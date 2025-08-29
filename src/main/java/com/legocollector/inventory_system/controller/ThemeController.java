package com.legocollector.inventory_system.controller;

import com.legocollector.inventory_system.model.Theme;
import com.legocollector.inventory_system.repository.ThemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/themes")
@CrossOrigin(origins = "http://localhost:5173")
public class ThemeController {

    @Autowired
    private ThemeRepository themeRepository;

    @GetMapping
    public List<Theme> getAllThemes() {
        return themeRepository.findAll();
    }

    // --- ADD THIS NEW METHOD ---
    @PostMapping
    public ResponseEntity<Theme> createTheme(@RequestBody Theme newTheme) {
        // Check if a theme with this name already exists to avoid duplicates
        Optional<Theme> existingTheme = themeRepository.findByNameIgnoreCase(newTheme.getName());
        if (existingTheme.isPresent()) {
            // If it exists, just return the existing one
            return ResponseEntity.ok(existingTheme.get());
        }
        // If it doesn't exist, save the new theme and return it
        Theme savedTheme = themeRepository.save(newTheme);
        return new ResponseEntity<>(savedTheme, HttpStatus.CREATED);
    }
}