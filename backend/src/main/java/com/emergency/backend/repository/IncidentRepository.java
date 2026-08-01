package com.emergency.backend.repository;

import com.emergency.backend.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Incident entity operations.
 * Provides methods for filtering, analytics, and search.
 */
@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

    // =========================
    // Basic Query Methods
    // =========================

    /** Find incidents by their current status */
    List<Incident> findByStatus(String status);

    /** Find all incidents reported by a specific user */
    List<Incident> findByUserEmail(String userEmail);

    /** Count incidents by status (for dashboard stats) */
    long countByStatus(String status);

    // =========================
    // Analytics Queries
    // =========================

    /** Count incidents grouped by category */
    @Query("SELECT i.category, COUNT(i) FROM Incident i GROUP BY i.category")
    List<Object[]> countByCategory();

    /** Count incidents created in a specific month/year */
    @Query("SELECT FUNCTION('MONTH', i.createdAt), FUNCTION('YEAR', i.createdAt), COUNT(i) " +
           "FROM Incident i WHERE i.createdAt IS NOT NULL " +
           "GROUP BY FUNCTION('MONTH', i.createdAt), FUNCTION('YEAR', i.createdAt) " +
           "ORDER BY FUNCTION('YEAR', i.createdAt), FUNCTION('MONTH', i.createdAt)")
    List<Object[]> countByMonth();

    /** Count incidents by status for a specific month/year */
    @Query("SELECT i.status, COUNT(i) FROM Incident i " +
           "WHERE FUNCTION('MONTH', i.createdAt) = :month " +
           "AND FUNCTION('YEAR', i.createdAt) = :year " +
           "GROUP BY i.status")
    List<Object[]> countByStatusForMonth(@Param("month") int month, @Param("year") int year);

    /** Find incidents with valid coordinates for map display */
    @Query("SELECT i FROM Incident i WHERE i.latitude IS NOT NULL AND i.longitude IS NOT NULL")
    List<Incident> findIncidentsWithCoordinates();

    /** Search incidents by title, category, or location */
    List<Incident> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String title, String category, String location);
}

