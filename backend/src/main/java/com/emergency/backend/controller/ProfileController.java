package com.emergency.backend.controller;

import com.emergency.backend.entity.User;
import com.emergency.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Controller for user profile management.
 * Handles profile updates, password changes, and picture uploads.
 */
@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    @Autowired
    private UserService userService;

    /**
     * Get user profile by email.
     */
    @GetMapping("/{email}")
    public ResponseEntity<?> getProfile(@PathVariable String email) {

        User user = userService.getUserByEmail(email);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Return user data without sensitive fields
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "fullName", user.getFullName(),
                "email", user.getEmail(),
                "mobile", user.getMobile(),
                "role", user.getRole(),
                "profilePicture", user.getProfilePicture()
        ));
    }

    /**
     * Update user profile (name, mobile).
     */
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> request) {

        try {
            User user = userService.updateProfile(
                    request.get("email"),
                    request.get("fullName"),
                    request.get("mobile")
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Profile updated successfully",
                    "fullName", user.getFullName(),
                    "mobile", user.getMobile()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Change user password.
     */
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {

        try {
            Map<String, String> response = userService.changePassword(
                    request.get("email"),
                    request.get("oldPassword"),
                    request.get("newPassword")
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Upload profile picture.
     */
    @PostMapping("/upload-picture")
    public ResponseEntity<?> uploadProfilePicture(
            @RequestParam("email") String email,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            User user = userService.uploadProfilePicture(email, file);
            return ResponseEntity.ok(Map.of(
                    "message", "Profile picture uploaded",
                    "profilePicture", user.getProfilePicture()
            ));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(
                    Map.of("error", "Failed to upload image")
            );
        }
    }
}

