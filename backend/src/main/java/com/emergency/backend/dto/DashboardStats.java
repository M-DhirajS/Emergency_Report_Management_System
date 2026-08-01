package com.emergency.backend.dto;

public class DashboardStats {

    private long totalUsers;
    private long totalIncidents;
    private long pendingIncidents;
    private long approvedIncidents;
    private long rejectedIncidents;

    public DashboardStats() {
    }

    public DashboardStats(long totalUsers,
                          long totalIncidents,
                          long pendingIncidents,
                          long approvedIncidents,
                          long rejectedIncidents) {

        this.totalUsers = totalUsers;
        this.totalIncidents = totalIncidents;
        this.pendingIncidents = pendingIncidents;
        this.approvedIncidents = approvedIncidents;
        this.rejectedIncidents = rejectedIncidents;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalIncidents() {
        return totalIncidents;
    }

    public void setTotalIncidents(long totalIncidents) {
        this.totalIncidents = totalIncidents;
    }

    public long getPendingIncidents() {
        return pendingIncidents;
    }

    public void setPendingIncidents(long pendingIncidents) {
        this.pendingIncidents = pendingIncidents;
    }

    public long getApprovedIncidents() {
        return approvedIncidents;
    }

    public void setApprovedIncidents(long approvedIncidents) {
        this.approvedIncidents = approvedIncidents;
    }

    public long getRejectedIncidents() {
        return rejectedIncidents;
    }

    public void setRejectedIncidents(long rejectedIncidents) {
        this.rejectedIncidents = rejectedIncidents;
    }
}