// src/main/java/com/legocollector/inventory_system/model/Theme.java
package com.legocollector.inventory_system.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

// @Entity tells Spring that this class is a database table.
@Entity
// @Table links this class to the actual table named "themes" in MySQL.
@Table(name = "themes")
public class Theme {

    // @Id marks this field as the table's Primary Key.
    @Id
    // @GeneratedValue tells Spring the database will create this value automatically.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    // --- Getters and Setters ---
    // These are methods to get and set the values of the fields.
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}