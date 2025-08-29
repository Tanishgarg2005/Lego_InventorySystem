// src/main/java/com/legocollector/inventorysystem/config/MvcConfig.java
package com.legocollector.inventory_system.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Resolve the absolute path to the uploads directory
        Path uploadDir = Paths.get("./uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        // This line makes the 'uploads' directory public
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:/" + uploadPath + "/");
    }
}