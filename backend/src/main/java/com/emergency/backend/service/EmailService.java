package com.emergency.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service for sending email notifications.
 * Handles incident confirmations, admin alerts, OTP emails, and status updates.
 */
@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Send a generic email.
     */
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            // Log the error but don't break the flow
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    /**
     * Send confirmation email after incident submission.
     */
    public void sendIncidentConfirmation(String userEmail, String title, String incidentId) {
        String subject = "🚨 Incident Report Confirmation - Emergency Alert System";
        String body = String.format("""
                Dear Citizen,

                Thank you for reporting the incident.

                📋 Incident Details:
                ─────────────────────
                • Report ID: %s
                • Title: %s
                • Status: Pending Review

                Your report has been submitted successfully and is now pending review by our team.
                You will be notified once the status changes.

                Stay Safe!
                - Emergency Alert System Team
                """, incidentId, title);

        sendEmail(userEmail, subject, body);
    }

    /**
     * Send notification to admin about a new incident.
     */
    public void sendAdminNotification(String adminEmail, String userEmail,
                                      String title, String incidentId) {
        String subject = "🚨 New Incident Reported - Action Required";
        String body = String.format("""
                Dear Admin,

                A new incident has been reported and requires your review.

                📋 Incident Details:
                ─────────────────────
                • Report ID: %s
                • Title: %s
                • Reported By: %s
                • Status: Pending

                Please login to the admin dashboard to review and take action.

                - Emergency Alert System
                """, incidentId, title, userEmail);

        sendEmail(adminEmail, subject, body);
    }

    /**
     * Send notification about incident status change.
     */
    public void sendStatusUpdate(String userEmail, String title,
                                 String status, String incidentId) {
        String subject = "📋 Incident Status Updated - Emergency Alert System";
        String body = String.format("""
                Dear Citizen,

                The status of your reported incident has been updated.

                📋 Incident Details:
                ─────────────────────
                • Report ID: %s
                • Title: %s
                • New Status: %s

                Thank you for your patience.
                - Emergency Alert System Team
                """, incidentId, title, status);

        sendEmail(userEmail, subject, body);
    }

    /**
     * Send OTP for password reset.
     */
    public void sendOtpEmail(String email, String otp) {
        String subject = "🔐 Password Reset OTP - Emergency Alert System";
        String body = String.format("""
                Dear User,

                You have requested to reset your password.

                Your OTP for password reset is: %s

                This OTP is valid for 10 minutes.
                If you did not request this, please ignore this email.

                - Emergency Alert System Team
                """, otp);

        sendEmail(email, subject, body);
    }
}

