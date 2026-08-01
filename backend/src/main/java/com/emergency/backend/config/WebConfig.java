package com.emergency.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC Configuration.
 * Maps the /uploads/** URL pattern to the file system directory for serving uploaded images.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir:${user.dir}/uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // Serve uploaded files from the uploads directory
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/");

        // Serve static resources (for future use)
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}

