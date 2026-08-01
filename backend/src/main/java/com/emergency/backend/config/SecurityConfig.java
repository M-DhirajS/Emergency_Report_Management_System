package com.emergency.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

/**
 * Spring Security Configuration.
 * Sets up JWT authentication, CORS, role-based access.
 * Uses NoOpPasswordEncoder for plain text password storage.
 */
@Configuration
@SuppressWarnings("deprecation")
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        // NoOpPasswordEncoder allows plain text passwords (not BCrypt)
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF (stateless API)
                .csrf(csrf -> csrf.disable())

                // CORS configuration
                .cors(cors -> cors.configurationSource(request -> {

                    CorsConfiguration configuration = new CorsConfiguration();

                    configuration.setAllowedOrigins(
                            List.of(
                                    "http://localhost:5173",
                                    "https://emergency-alert-frontend.vercel.app"
                            )
                    );

                    configuration.setAllowedMethods(
                            List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                    );

                    configuration.setAllowedHeaders(
                            List.of("*")
                    );

                    configuration.setExposedHeaders(
                            List.of("Authorization", "Content-Disposition")
                    );

                    configuration.setAllowCredentials(true);

                    return configuration;

                }))

                // Make session stateless (JWT does not use sessions)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Define public and protected endpoints
                .authorizeHttpRequests(auth -> auth

                        // Public endpoints (no authentication required)
                        .requestMatchers(
                                "/api/register",
                                "/api/login",
                                "/api/forgot-password/**",
                                "/api/reset-password/**",
                                "/api/verify-otp",
                                "/api/weather/**",
                                "/api/news/**",
                                "/uploads/**",
                                "/api/incidents/**",
                                "/api/dashboard/stats",
                                "/ws/**"
                        ).permitAll()

                        // Admin-only endpoints
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // All other endpoints require authentication
                        .anyRequest().authenticated()

                )

                // Add JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

                // Disable form login
                .formLogin(form -> form.disable())

                // Disable HTTP basic
                .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }
}
