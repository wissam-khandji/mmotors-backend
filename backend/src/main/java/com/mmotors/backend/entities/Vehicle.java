package com.mmotors.backend.entities;

import jakarta.persistence.*;
import jakarta.persistence.Lob;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entité représentant un véhicule dans le système M-Motors.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    private int annee;

    private String energie;

    private String transmission;

    @Column(columnDefinition = "TEXT")
    private String imagePath;
}
