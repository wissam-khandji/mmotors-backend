package com.mmotors.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité représentant un véhicule dans le système M-Motors.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String marque;
    
    @Column(nullable = false)
    private String modele;
    
    private int kilometrage;
    
    private double prix;
    
    @Enumerated(EnumType.STRING)
    private VehicleCategory categorie;
    
    @Enumerated(EnumType.STRING)
    private VehicleStatus statut;
}

