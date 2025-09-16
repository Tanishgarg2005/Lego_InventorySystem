package com.legocollector.inventory_system.repository;

import com.legocollector.inventory_system.model.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; 
public interface ThemeRepository extends JpaRepository<Theme, Integer> {

    
    Optional<Theme> findByNameIgnoreCase(String name);
    
    
}