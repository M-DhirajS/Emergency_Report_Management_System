package com.emergency.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

/**
 * WebSocket Controller for real-time notifications.
 * Handles sending notifications to admin and users about incident updates.
 */
@Controller
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Send a notification to all subscribed clients (broadcast).
     * Used for: new incident alerts, general announcements.
     */
    @MessageMapping("/notification")
    @SendTo("/topic/notifications")
    public Map<String, Object> broadcastNotification(Map<String, Object> notification) {
        return notification;
    }

    /**
     * Send a notification to a specific user.
     * Used for: incident approval/rejection status updates.
     */
    public void sendToUser(String email, String title, String message, String status) {
        Map<String, Object> notification = Map.of(
                "type", "status_update",
                "title", title,
                "message", message,
                "status", status,
                "timestamp", System.currentTimeMillis()
        );

        messagingTemplate.convertAndSendToUser(
                email,
                "/queue/notifications",
                notification
        );
    }

    /**
     * Send a notification to all admins.
     * Used for: new incident reported alerts.
     */
    public void sendToAdmins(String title, String userEmail, Long incidentId) {
        Map<String, Object> notification = Map.of(
                "type", "new_incident",
                "title", title,
                "message", "New incident reported by " + userEmail,
                "incidentId", incidentId,
                "timestamp", System.currentTimeMillis()
        );

        messagingTemplate.convertAndSend(
                "/topic/admin-notifications",
                notification
        );
    }

    /**
     * General notification broadcast.
     */
    public void sendBroadcast(String message, String type) {
        Map<String, Object> notification = Map.of(
                "type", type,
                "message", message,
                "timestamp", System.currentTimeMillis()
        );

        messagingTemplate.convertAndSend("/topic/notifications", notification);
    }
}

