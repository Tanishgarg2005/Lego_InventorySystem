package com.legocollector.inventory_system.repository;

import com.legocollector.inventory_system.model.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // <-- Add this import

public interface ThemeRepository extends JpaRepository<Theme, Integer> {

    // --- ADD THIS METHOD DEFINITION ---
    Optional<Theme> findByNameIgnoreCase(String name);
    // --------------------------------
    
}