package com.emergency.backend.controller;

import com.emergency.backend.entity.User;
import com.emergency.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for user authentication and account management.
 * Handles registration, login, forgot password, and password reset.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    /**
     * Register a new user account.
     * Returns JWT token and user details on success.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        try {
            Map<String, Object> response = userService.register(user);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Login with email and password.
     * Returns JWT token and user details on success.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        try {
            Map<String, Object> response = userService.login(
                    user.getEmail(),
                    user.getPassword()
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Send OTP to user's email for password reset.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {

        try {
            Map<String, String> response = userService.forgotPassword(
                    request.get("email")
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Verify the OTP sent to user's email.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {

        try {
            Map<String, Object> response = userService.verifyOtp(
                    request.get("email"),
                    request.get("otp")
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    /**
     * Reset password using OTP verification.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {

        try {
            Map<String, String> response = userService.resetPassword(
                    request.get("email"),
                    request.get("otp"),
                    request.get("newPassword")
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }
}

