package com.emergency.backend.service;

import com.emergency.backend.dto.DashboardStats;
import com.emergency.backend.entity.Incident;
import com.emergency.backend.repository.IncidentRepository;
import com.emergency.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for dashboard statistics and analytics.
 * Provides aggregate data, monthly reports, and category-wise breakdowns.
 */
@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IncidentRepository incidentRepository;

    /**
     * Get overall dashboard statistics.
     */
    public DashboardStats getDashboardStats() {

        DashboardStats stats = new DashboardStats();

        stats.setTotalUsers(userRepository.count());
        stats.setTotalIncidents(incidentRepository.count());

        stats.setPendingIncidents(
                incidentRepository.countByStatus("Pending")
        );

        stats.setApprovedIncidents(
                incidentRepository.countByStatus("Approved")
        );

        stats.setRejectedIncidents(
                incidentRepository.countByStatus("Rejected")
        );

        return stats;
    }

    /**
     * Get detailed analytics for admin dashboard.
     * Returns category-wise stats, monthly trends, and status breakdowns.
     */
    public Map<String, Object> getDetailedAnalytics() {

        Map<String, Object> analytics = new HashMap<>();

        // 1. Category-wise incident counts
        List<Object[]> categoryData = incidentRepository.countByCategory();
        List<Map<String, Object>> categoryStats = new ArrayList<>();

        for (Object[] row : categoryData) {
            Map<String, Object> item = new HashMap<>();
            item.put("category", row[0] != null ? row[0] : "Unknown");
            item.put("count", row[1] != null ? row[1] : 0);
            categoryStats.add(item);
        }
        analytics.put("categoryWise", categoryStats);

        // 2. Monthly incident trends (current year)
        List<Object[]> monthlyData = incidentRepository.countByMonth();
        List<Map<String, Object>> monthlyStats = new ArrayList<>();

        // Create month names lookup
        String[] monthNames = {
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        };

        for (Object[] row : monthlyData) {
            Map<String, Object> item = new HashMap<>();
            int month = ((Number) row[0]).intValue();
            int year = ((Number) row[1]).intValue();
            item.put("month", monthNames[month - 1]);
            item.put("monthNum", month);
            item.put("year", year);
            item.put("count", row[2] != null ? row[2] : 0);
            monthlyStats.add(item);
        }
        analytics.put("monthlyTrends", monthlyStats);

        // 3. Status breakdown
        Map<String, Object> statusBreakdown = new HashMap<>();
        statusBreakdown.put("pending", incidentRepository.countByStatus("Pending"));
        statusBreakdown.put("approved", incidentRepository.countByStatus("Approved"));
        statusBreakdown.put("rejected", incidentRepository.countByStatus("Rejected"));
        analytics.put("statusBreakdown", statusBreakdown);

        // 4. Total counts
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalIncidents", incidentRepository.count());

        return analytics;
    }
}

