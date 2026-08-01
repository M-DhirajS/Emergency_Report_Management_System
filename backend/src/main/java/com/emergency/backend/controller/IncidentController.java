package com.emergency.backend.controller;

import com.emergency.backend.entity.Incident;
import com.emergency.backend.service.IncidentService;
import com.emergency.backend.service.PdfExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * Controller for incident management.
 * Handles CRUD operations, image upload, status workflow, and search.
 */
@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "http://localhost:5173")
public class IncidentController {

    @Autowired
    private IncidentService incidentService;

    @Autowired
    private PdfExportService pdfExportService;

    // =========================
    // Create New Incident
    // =========================
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> saveIncident(
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("description") String description,
            @RequestParam("location") String location,
            @RequestParam("userEmail") String userEmail,
            @RequestParam(value = "latitude", required = false) Double latitude,
            @RequestParam(value = "longitude", required = false) Double longitude,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            Incident incident = incidentService.saveIncident(
                    title,
                    category,
                    description,
                    location,
                    userEmail,
                    latitude,
                    longitude,
                    image
            );
            return ResponseEntity.ok(incident);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Failed to upload image: " + e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    // =========================
    // Get All Incidents
    // =========================
    @GetMapping
    public List<Incident> getAllIncidents() {
        return incidentService.getAllIncidents();
    }

    // =========================
    // Get Incident By Id
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<?> getIncidentById(@PathVariable Long id) {

        Incident incident = incidentService.getIncidentById(id);

        if (incident == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(incident);
    }

    // =========================
    // Get User Incidents
    // =========================
    @GetMapping("/user/{email}")
    public List<Incident> getUserIncidents(@PathVariable String email) {
        return incidentService.getUserIncidents(email);
    }

    // =========================
    // Get Incidents By Status
    // =========================
    @GetMapping("/status/{status}")
    public List<Incident> getIncidentByStatus(@PathVariable String status) {
        return incidentService.getIncidentByStatus(status);
    }

    // =========================
    // Get Incidents with Map Coordinates
    // =========================
    @GetMapping("/map")
    public List<Incident> getIncidentsForMap() {
        return incidentService.getIncidentsWithCoordinates();
    }

    // =========================
    // Search Incidents
    // =========================
    @GetMapping("/search")
    public List<Incident> searchIncidents(@RequestParam("q") String query) {
        return incidentService.searchIncidents(query);
    }

    // =========================
    // Approve Incident
    // =========================
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveIncident(@PathVariable Long id) {

        Incident incident = incidentService.approveIncident(id);

        if (incident == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(incident);
    }

    // =========================
    // Reject Incident
    // =========================
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectIncident(@PathVariable Long id) {

        Incident incident = incidentService.rejectIncident(id);

        if (incident == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(incident);
    }

    // =========================
    // Delete Incident
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncident(@PathVariable Long id) {

        try {
            incidentService.deleteIncident(id);
            return ResponseEntity.ok(
                    Map.of("message", "Incident deleted successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    // =========================
    // Download Incident PDF Report
    // =========================
    @GetMapping("/{id}/pdf")
    public ResponseEntity<?> downloadIncidentPdf(@PathVariable Long id) {

        try {
            Incident incident = incidentService.getIncidentById(id);

            if (incident == null) {
                return ResponseEntity.notFound().build();
            }

            byte[] pdfBytes = pdfExportService.generateIncidentReport(incident);

            String filename = "Incident_Report_" + id + ".pdf";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" + filename)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Failed to generate PDF: " + e.getMessage())
            );
        }
    }
}

