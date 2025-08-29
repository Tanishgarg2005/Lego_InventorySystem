package com.legocollector.inventory_system.controller;

import com.legocollector.inventory_system.model.Minifigure;
import com.legocollector.inventory_system.repository.MinifigureRepository;
import com.legocollector.inventory_system.service.FileStorageService;
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

    @Autowired
    private FileStorageService storageService;

    @GetMapping
    public List<Minifigure> getAllMinifigures(
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String theme
    ) {
        // ... (this method remains the same)
        Sort sort = Sort.by("name");
        if ("valueDesc".equals(sortBy)) { sort = Sort.by("estimatedValue").descending(); } 
        else if ("valueAsc".equals(sortBy)) { sort = Sort.by("estimatedValue").ascending(); }
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

    // --- THIS IS THE METHOD TO UPDATE ---
    @PutMapping("/{id}")
    public ResponseEntity<Minifigure> updateMinifigure(@PathVariable Integer id, @RequestBody Minifigure updatedMinifigure) {
        return minifigureRepository.findById(id)
            .map(existingMinifigure -> {
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
                
                // --- ADD THIS LINE TO FIX THE BUG ---
                existingMinifigure.setQuantity(updatedMinifigure.getQuantity());
                
                Minifigure savedMinifigure = minifigureRepository.save(existingMinifigure);
                return ResponseEntity.ok(savedMinifigure);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMinifigure(@PathVariable Integer id) {
        // ... (this method remains the same)
        return minifigureRepository.findById(id).map(minifigure -> {
            if (minifigure.getPhotoFilename() != null && !minifigure.getPhotoFilename().isEmpty()) {
                storageService.delete(minifigure.getPhotoFilename());
            }
            minifigureRepository.deleteById(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}