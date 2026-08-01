package com.emergency.backend.controller;

import com.emergency.backend.dto.DashboardStats;
import com.emergency.backend.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for dashboard statistics and analytics.
 * Provides aggregate data for admin and user dashboards.
 */
@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Get overall dashboard statistics.
     * Returns counts of users, incidents, and status breakdowns.
     */
    @GetMapping("/stats")
    public DashboardStats getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
}

