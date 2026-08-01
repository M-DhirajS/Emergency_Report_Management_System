package com.emergency.backend.repository;

import com.emergency.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for User entity operations.
 * Provides methods for authentication, user management, and search.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Find user by email (used for login and duplicate check) */
    User findByEmail(String email);

    /** Find user by email and plain text password (legacy - will be replaced by JWT) */
    User findByEmailAndPassword(String email, String password);

    /** Count total number of registered users */
    long count();

    /** Search users by name or email (for admin user management) */
    List<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String fullName, String email);

    /** Check if a user with given email exists */
    boolean existsByEmail(String email);
}

