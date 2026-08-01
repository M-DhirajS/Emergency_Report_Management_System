package com.emergency.backend.service;

import com.emergency.backend.entity.Incident;
import com.emergency.backend.entity.User;
import com.emergency.backend.repository.IncidentRepository;
import com.emergency.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Service for incident management operations.
 * Handles CRUD, image upload, approval/rejection workflow, and search.
 */
@Service
public class IncidentService {

    @Autowired
    private IncidentRepository incidentRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    /** Directory for storing incident images */
    private static final String UPLOAD_DIR =
            System.getProperty("user.dir") +
            File.separator +
            "uploads" +
            File.separator;

    // =========================
    // Save Incident with Image
    // =========================
    public Incident saveIncident(
            String title,
            String category,
            String description,
            String location,
            String userEmail,
            Double latitude,
            Double longitude,
            MultipartFile image
    ) throws IOException {

        Incident incident = new Incident();

        incident.setTitle(title);
        incident.setCategory(category);
        incident.setDescription(description);
        incident.setLocation(location);
        incident.setUserEmail(userEmail);
        incident.setStatus("Pending");
        incident.setLatitude(latitude);
        incident.setLongitude(longitude);

        // Create upload directory if it doesn't exist
        File uploadFolder = new File(UPLOAD_DIR);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        // Save image if provided
        if (image != null && !image.isEmpty()) {
            String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
            File destination = new File(uploadFolder, fileName);
            image.transferTo(destination);
            incident.setImage(fileName);
        }

        Incident savedIncident = incidentRepository.save(incident);

        // Send email confirmation to the user
        try {
            emailService.sendIncidentConfirmation(
                    userEmail,
                    title,
                    savedIncident.getId().toString()
            );
        } catch (Exception e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }

        // Notify admin via WebSocket
        try {
            notificationService.sendToAdmins(title, userEmail, savedIncident.getId());
        } catch (Exception e) {
            System.err.println("Failed to send WebSocket notification: " + e.getMessage());
        }

        // Send email to admin
        try {
            List<User> admins = userRepository.findAll();
            for (User admin : admins) {
                if ("ADMIN".equals(admin.getRole())) {
                    emailService.sendAdminNotification(
                            admin.getEmail(),
                            userEmail,
                            title,
                            savedIncident.getId().toString()
                    );
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to send admin email: " + e.getMessage());
        }

        return savedIncident;
    }

    // =========================
    // Get All Incidents
    // =========================
    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    // =========================
    // Get Incident By Id
    // =========================
    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id).orElse(null);
    }

    // =========================
    // Get User Incidents
    // =========================
    public List<Incident> getUserIncidents(String email) {
        return incidentRepository.findByUserEmail(email);
    }

    // =========================
    // Get Incidents By Status
    // =========================
    public List<Incident> getIncidentByStatus(String status) {
        return incidentRepository.findByStatus(status);
    }

    // =========================
    // Get Incidents with Coordinates (for Map)
    // =========================
    public List<Incident> getIncidentsWithCoordinates() {
        return incidentRepository.findIncidentsWithCoordinates();
    }

    // =========================
    // Search Incidents
    // =========================
    public List<Incident> searchIncidents(String query) {
        return incidentRepository
                .findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrLocationContainingIgnoreCase(
                        query, query, query
                );
    }

    // =========================
    // Approve Incident
    // =========================
    public Incident approveIncident(Long id) {

        Incident incident = incidentRepository.findById(id).orElse(null);

        if (incident == null) {
            return null;
        }

        incident.setStatus("Approved");
        Incident savedIncident = incidentRepository.save(incident);

        // Notify user via email
        try {
            emailService.sendStatusUpdate(
                    incident.getUserEmail(),
                    incident.getTitle(),
                    "Approved",
                    incident.getId().toString()
            );
        } catch (Exception e) {
            System.err.println("Failed to send status email: " + e.getMessage());
        }

        // Notify user via WebSocket
        try {
            notificationService.sendToUser(
                    incident.getUserEmail(),
                    incident.getTitle(),
                    "Your incident report has been approved.",
                    "Approved"
            );
        } catch (Exception e) {
            System.err.println("Failed to send WebSocket notification: " + e.getMessage());
        }

        return savedIncident;
    }

    // =========================
    // Reject Incident
    // =========================
    public Incident rejectIncident(Long id) {

        Incident incident = incidentRepository.findById(id).orElse(null);

        if (incident == null) {
            return null;
        }

        incident.setStatus("Rejected");
        Incident savedIncident = incidentRepository.save(incident);

        // Notify user via email
        try {
            emailService.sendStatusUpdate(
                    incident.getUserEmail(),
                    incident.getTitle(),
                    "Rejected",
                    incident.getId().toString()
            );
        } catch (Exception e) {
            System.err.println("Failed to send status email: " + e.getMessage());
        }

        // Notify user via WebSocket
        try {
            notificationService.sendToUser(
                    incident.getUserEmail(),
                    incident.getTitle(),
                    "Your incident report has been rejected.",
                    "Rejected"
            );
        } catch (Exception e) {
            System.err.println("Failed to send WebSocket notification: " + e.getMessage());
        }

        return savedIncident;
    }

    // =========================
    // Update Status
    // =========================
    public Incident updateStatus(Long id, String status) {

        Incident incident = incidentRepository.findById(id).orElse(null);

        if (incident == null) {
            return null;
        }

        incident.setStatus(status);
        return incidentRepository.save(incident);
    }

    // =========================
    // Delete Incident
    // =========================
    public void deleteIncident(Long id) {

        // Also delete the associated image file if it exists
        Incident incident = incidentRepository.findById(id).orElse(null);
        if (incident != null && incident.getImage() != null) {
            try {
                File imageFile = new File(UPLOAD_DIR + incident.getImage());
                if (imageFile.exists()) {
                    imageFile.delete();
                }
            } catch (Exception e) {
                System.err.println("Failed to delete image file: " + e.getMessage());
            }
        }

        incidentRepository.deleteById(id);
    }
}

