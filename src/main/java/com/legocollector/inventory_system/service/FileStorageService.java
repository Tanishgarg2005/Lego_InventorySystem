// src/main/java/com/legocollector/inventorysystem/service/FileStorageService.java
package com.legocollector.inventory_system.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    // Create a folder named "uploads" in your project's root directory
    private final Path root = Paths.get("uploads");

    public FileStorageService() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }

    public String save(MultipartFile file) {
        try {
            // Generate a unique filename to avoid conflicts
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));
            return filename;
        } catch (Exception e) {
            throw new RuntimeException("Could not store the file. Error: " + e.getMessage());
        }
    }
    // Add this method inside your FileStorageService class
    public void delete(String filename) {
        try {
            Files.deleteIfExists(root.resolve(filename));
        } catch (IOException e) {
            // We can log this error, but we don't want to stop the main delete operation
            System.err.println("Could not delete the file: " + filename + ". Error: " + e.getMessage());
        }
    }
}