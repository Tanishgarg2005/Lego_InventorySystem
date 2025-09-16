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

    @PostMapping
    public ResponseEntity<Theme> createTheme(@RequestBody Theme newTheme) {

        Optional<Theme> existingTheme = themeRepository.findByNameIgnoreCase(newTheme.getName());
        if (existingTheme.isPresent()) {

            return ResponseEntity.ok(existingTheme.get());
        }

        Theme savedTheme = themeRepository.save(newTheme);
        return new ResponseEntity<>(savedTheme, HttpStatus.CREATED);
    }
}