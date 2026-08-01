package com.emergency.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Incident Entity - Represents an emergency incident reported by a user.
 * Tracks status, image, location, and timestamps.
 */
@Entity
@Table(name = "incidents")
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // Fire, Flood, Medical, Accident, Earthquake

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String location;

    /** Email of the user who reported this incident */
    private String userEmail;

    /** Current status: Pending, Approved, Rejected */
    @Column(nullable = false)
    private String status = "Pending";

    /** File name of the uploaded incident image */
    private String image;

    /** Latitude for map marker */
    private Double latitude;

    /** Longitude for map marker */
    private Double longitude;

    /** Timestamp when the incident was created */
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "Pending";
        }
    }

    // =========================
    // Constructors
    // =========================
    public Incident() {
    }

    public Incident(Long id, String title, String category,
                    String description, String location,
                    String userEmail, String status, String image,
                    Double latitude, Double longitude, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.description = description;
        this.location = location;
        this.userEmail = userEmail;
        this.status = status;
        this.image = image;
        this.latitude = latitude;
        this.longitude = longitude;
        this.createdAt = createdAt;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

