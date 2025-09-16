package com.legocollector.inventory_system.repository;

import com.legocollector.inventory_system.model.Minifigure;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; 
import org.springframework.data.repository.query.Param; 
import java.util.List;

public interface MinifigureRepository extends JpaRepository<Minifigure, Integer> {

    
    @Query("SELECT m FROM Minifigure m JOIN m.theme t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :themeName, '%'))")
    List<Minifigure> findByThemeNameContainingIgnoreCase(@Param("themeName") String themeName, Sort sort);
}