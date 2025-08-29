package com.legocollector.inventory_system.controller;

import com.legocollector.inventory_system.model.Minifigure;
import com.legocollector.inventory_system.repository.MinifigureRepository;
import com.legocollector.inventory_system.service.FileStorageService; // <-- Add this import
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/minifigures")
public class MinifigureController {

    @Autowired
    private MinifigureRepository minifigureRepository;

    // --- ADD THIS ---
    @Autowired
    private FileStorageService storageService;
    // ---------------

    @GetMapping
    public List<Minifigure> getAllMinifigures(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String theme
    ) {
        Sort sort = Sort.by("name");

        if ("valueDesc".equals(sortBy)) {
            sort = Sort.by("estimatedValue").descending();
        } else if ("valueAsc".equals(sortBy)) {
            sort = Sort.by("estimatedValue").ascending();
        }

        if (theme != null && !theme.isEmpty()) {
            return minifigureRepository.findByThemeNameContainingIgnoreCase(theme, sort);
        } else {
            return minifigureRepository.findAll(sort);
        }
    }

    @PostMapping
    public Minifigure createMinifigure(@RequestBody Minifigure minifigure) {
        return minifigureRepository.save(minifigure);
    }

    // --- ADD THIS NEW METHOD FOR DELETING ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMinifigure(@PathVariable Integer id) {
        // Find the minifigure first to get its photo filename
        return minifigureRepository.findById(id).map(minifigure -> {
            // If a photo exists, delete it from the server's 'uploads' folder
            if (minifigure.getPhotoFilename() != null && !minifigure.getPhotoFilename().isEmpty()) {
                storageService.delete(minifigure.getPhotoFilename());
            }
            // Delete the minifigure record from the database
            minifigureRepository.deleteById(id);
            // Return a success response with no content
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build()); // Or return not found if the ID doesn't exist
    }
    // -----------------------------------------
    // Add this method inside your MinifigureController.java class

@PutMapping("/{id}")
public ResponseEntity<Minifigure> updateMinifigure(@PathVariable Integer id, @RequestBody Minifigure updatedMinifigure) {
    return minifigureRepository.findById(id)
        .map(existingMinifigure -> {
            // Update only the fields that were sent in the request
            // This is a simplified example; a real app might use a more robust mapping strategy
            existingMinifigure.setName(updatedMinifigure.getName());
            existingMinifigure.setPersonalNumber(updatedMinifigure.getPersonalNumber());
            existingMinifigure.setTheme(updatedMinifigure.getTheme());
            existingMinifigure.setReleaseDate(updatedMinifigure.getReleaseDate());
            existingMinifigure.setBricklinkNumber(updatedMinifigure.getBricklinkNumber());
            existingMinifigure.setEstimatedValue(updatedMinifigure.getEstimatedValue());
            existingMinifigure.setPurchaseDate(updatedMinifigure.getPurchaseDate());
            existingMinifigure.setPurchasePrice(updatedMinifigure.getPurchasePrice());
            existingMinifigure.setShippingCost(updatedMinifigure.getShippingCost());
            existingMinifigure.setNotes(updatedMinifigure.getNotes());
            
            // We don't update the photo filename here, as that's a separate process
            
            Minifigure savedMinifigure = minifigureRepository.save(existingMinifigure);
            return ResponseEntity.ok(savedMinifigure);
        })
        .orElse(ResponseEntity.notFound().build());
}
}