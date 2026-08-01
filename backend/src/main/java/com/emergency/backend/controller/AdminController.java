package com.emergency.backend.controller;

import com.emergency.backend.entity.Incident;
import com.emergency.backend.entity.User;
import com.emergency.backend.service.DashboardService;
import com.emergency.backend.service.ExportService;
import com.emergency.backend.service.IncidentService;
import com.emergency.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Controller for admin-only operations.
 * Handles user management, analytics, and data exports.
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private IncidentService incidentService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private ExportService exportService;

    // =========================
    // User Management
    // =========================

    /**
     * Get all registered users.
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestParam(required = false) String search) {

        List<User> users;

        if (search != null && !search.isEmpty()) {
            users = userService.searchUsers(search);
        } else {
            users = userService.getAllUsers();
        }

        // Return list without passwords
        List<Map<String, Object>> safeUsers = users.stream().map(user -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("fullName", user.getFullName());
            map.put("email", user.getEmail());
            map.put("mobile", user.getMobile());
            map.put("role", user.getRole());
            map.put("blocked", user.isBlocked());
            map.put("profilePicture", user.getProfilePicture());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(safeUsers);
    }

    /**
     * Block or unblock a user account.
     */
    @PutMapping("/users/{id}/toggle-block")
    public ResponseEntity<?> toggleBlockUser(@PathVariable Long id) {

        try {
            User user = userService.toggleBlockUser(id);
            return ResponseEntity.ok(Map.of(
                    "message", user.isBlocked() ? "User blocked" : "User unblocked",
                    "blocked", user.isBlocked()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Delete a user account.
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(
                    Map.of("message", "User deleted successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    // =========================
    // Analytics
    // =========================

    /**
     * Get analytics data: monthly reports, category-wise stats.
     */
    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {

        try {
            Map<String, Object> analytics = dashboardService.getDetailedAnalytics();
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    // =========================
    // Excel Export
    // =========================

    /**
     * Export all incidents as Excel file (Admin only).
     */
    @GetMapping("/export/excel")
    public ResponseEntity<?> exportIncidentsExcel() {

        try {
            List<Incident> incidents = incidentService.getAllIncidents();
            byte[] excelData = exportService.exportIncidentsToExcel(incidents);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=incidents_" +
                            LocalDateTime.now().toString().substring(0, 10) + ".xlsx")
                    .contentType(MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelData);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Failed to export Excel: " + e.getMessage())
            );
        }
    }
}

