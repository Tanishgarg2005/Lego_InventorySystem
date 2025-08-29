// src/main/java/com/legocollector/inventorysystem/controller/FileUploadController.java
package com.legocollector.inventory_system.controller;

import com.legocollector.inventory_system.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:5173") // Or your frontend's port
public class FileUploadController {

    @Autowired
    private FileStorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String filename = storageService.save(file);
            return ResponseEntity.ok(filename);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Could not upload the file: " + file.getOriginalFilename() + "!");
        }
    }
}