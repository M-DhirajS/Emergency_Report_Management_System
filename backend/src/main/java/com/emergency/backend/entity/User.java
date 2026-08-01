package com.emergency.backend.entity;

import jakarta.persistence.*;

/**
 * User Entity - Represents a system user (Admin or Regular User).
 * Stores authentication details, profile info, and account status.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String mobile;

    @Column(nullable = false)
    private String password;

    private String role; // "USER" or "ADMIN"

    /** File name of the user's profile picture */
    private String profilePicture;

    /** OTP for forgot password functionality */
    private String otp;

    /** Whether the user account is blocked by admin */
    @Column(columnDefinition = "boolean default false")
    private boolean blocked = false;

    /** Timestamp when OTP was generated (for expiry check) */
    private Long otpGeneratedAt;

    // =========================
    // Constructors
    // =========================
    public User() {
    }

    public User(Long id, String fullName, String email,
                String mobile, String password, String role,
                String profilePicture, String otp, boolean blocked) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobile = mobile;
        this.password = password;
        this.role = role;
        this.profilePicture = profilePicture;
        this.otp = otp;
        this.blocked = blocked;
    }

    // =========================
    // Getters & Setters
    // =========================
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public boolean isBlocked() {
        return blocked;
    }

    public void setBlocked(boolean blocked) {
        this.blocked = blocked;
    }

    public Long getOtpGeneratedAt() {
        return otpGeneratedAt;
    }

    public void setOtpGeneratedAt(Long otpGeneratedAt) {
        this.otpGeneratedAt = otpGeneratedAt;
    }
}

