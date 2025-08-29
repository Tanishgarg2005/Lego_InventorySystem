package com.legocollector.inventory_system.repository;

import com.legocollector.inventory_system.model.Minifigure;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- Add new import
import org.springframework.data.repository.query.Param; // <-- Add new import
import java.util.List;

public interface MinifigureRepository extends JpaRepository<Minifigure, Integer> {

    /**
     * This custom query finds minifigures by joining with the Theme table and
     * checking the theme's name in a case-insensitive way.
     */
    @Query("SELECT m FROM Minifigure m JOIN m.theme t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :themeName, '%'))")
    List<Minifigure> findByThemeNameContainingIgnoreCase(@Param("themeName") String themeName, Sort sort);
}