package com.emergency.backend.service;

import com.emergency.backend.config.JwtUtil;
import com.emergency.backend.entity.User;
import com.emergency.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

/**
 * Service for user management operations.
 * Uses plain text password storage (no BCrypt encoding).
 * Handles registration, login (JWT), profile updates, password changes,
 * forgot password (OTP), and admin user management.
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    /** Directory for storing profile pictures */
    private static final String UPLOAD_DIR =
            System.getProperty("user.dir") +
            File.separator +
            "uploads" +
            File.separator +
            "profiles" +
            File.separator;

    // =========================
    // Register User
    // =========================
    public Map<String, Object> register(User user) {

        // Check if email already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Save password as plain text (no BCrypt encoding)
        // Set default role if not provided
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        // Save user
        User savedUser = userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(savedUser.getEmail(), savedUser.getRole());

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", savedUser.getId());
        response.put("fullName", savedUser.getFullName());
        response.put("email", savedUser.getEmail());
        response.put("mobile", savedUser.getMobile());
        response.put("role", savedUser.getRole());
        response.put("profilePicture", savedUser.getProfilePicture());

        return response;
    }

    // =========================
    // Login User (Returns JWT)
    // =========================
    public Map<String, Object> login(String email, String password) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("Invalid email or password");
        }

        // Check if user is blocked
        if (user.isBlocked()) {
            throw new RuntimeException("Your account has been blocked. Contact admin.");
        }

        // Verify password using plain text comparison
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        // Build response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("id", user.getId());
        response.put("fullName", user.getFullName());
        response.put("email", user.getEmail());
        response.put("mobile", user.getMobile());
        response.put("role", user.getRole());
        response.put("profilePicture", user.getProfilePicture());

        return response;
    }

    // =========================
    // Get User By Email
    // =========================
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // =========================
    // Get User By Id
    // =========================
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    // =========================
    // Update Profile
    // =========================
    public User updateProfile(String email, String fullName, String mobile) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }

        if (mobile != null && !mobile.isEmpty()) {
            user.setMobile(mobile);
        }

        return userRepository.save(user);
    }

    // =========================
    // Change Password
    // =========================
    public Map<String, String> changePassword(String email,
                                               String oldPassword,
                                               String newPassword) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Verify old password using plain text comparison
        if (!user.getPassword().equals(oldPassword)) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Update to new password (plain text)
        user.setPassword(newPassword);
        userRepository.save(user);

        return Map.of("message", "Password changed successfully");
    }

    // =========================
    // Upload Profile Picture
    // =========================
    public User uploadProfilePicture(String email, MultipartFile file) throws IOException {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Create upload directory if it doesn't exist
        File uploadFolder = new File(UPLOAD_DIR);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        // Save file with unique name
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File destination = new File(uploadFolder, fileName);
        file.transferTo(destination);

        // Update user's profile picture
        user.setProfilePicture("profiles/" + fileName);
        return userRepository.save(user);
    }

    // =========================
    // Forgot Password - Send OTP
    // =========================
    public Map<String, String> forgotPassword(String email) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            // Don't reveal that email doesn't exist for security
            return Map.of("message",
                    "If the email exists, an OTP has been sent");
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        // Store OTP and generation time
        user.setOtp(otp);
        user.setOtpGeneratedAt(System.currentTimeMillis());
        userRepository.save(user);

        // Send OTP via email
        emailService.sendOtpEmail(email, otp);

        return Map.of("message", "OTP sent to your email");
    }

    // =========================
    // Verify OTP
    // =========================
    public Map<String, Object> verifyOtp(String email, String otp) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("Invalid request");
        }

        // Check if OTP matches
        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // Check if OTP is expired (10 minutes)
        long currentTime = System.currentTimeMillis();
        long otpTime = user.getOtpGeneratedAt() != null ? user.getOtpGeneratedAt() : 0;

        if (currentTime - otpTime > 10 * 60 * 1000) {
            // Clear expired OTP
            user.setOtp(null);
            user.setOtpGeneratedAt(null);
            userRepository.save(user);
            throw new RuntimeException("OTP has expired");
        }

        // Generate a temporary reset token
        String resetToken = UUID.randomUUID().toString();

        return Map.of(
                "message", "OTP verified successfully",
                "resetToken", resetToken,
                "email", email
        );
    }

    // =========================
    // Reset Password
    // =========================
    public Map<String, String> resetPassword(String email,
                                              String otp,
                                              String newPassword) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("Invalid request");
        }

        // Verify OTP
        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        // Check expiry
        long currentTime = System.currentTimeMillis();
        long otpTime = user.getOtpGeneratedAt() != null ? user.getOtpGeneratedAt() : 0;

        if (currentTime - otpTime > 10 * 60 * 1000) {
            user.setOtp(null);
            user.setOtpGeneratedAt(null);
            userRepository.save(user);
            throw new RuntimeException("OTP has expired");
        }

        // Update password (plain text)
        user.setPassword(newPassword);

        // Clear OTP
        user.setOtp(null);
        user.setOtpGeneratedAt(null);

        userRepository.save(user);

        return Map.of("message", "Password reset successfully");
    }

    // =========================
    // Admin: Get All Users
    // =========================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // =========================
    // Admin: Search Users
    // =========================
    public List<User> searchUsers(String query) {
        return userRepository
                .findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }

    // =========================
    // Admin: Block/Unblock User
    // =========================
    public User toggleBlockUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBlocked(!user.isBlocked());
        return userRepository.save(user);
    }

    // =========================
    // Admin: Delete User
    // =========================
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}
