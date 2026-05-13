package com.mmotors.backend.repositories;

import com.mmotors.backend.entities.Vehicle;
import com.mmotors.backend.entities.VehicleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository pour l'accès aux données des véhicules.
 */
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    /**
     * Filtre les véhicules par catégorie.
     * 
     * @param categorie La catégorie de véhicule (VENTE ou LOCATION).
     * @return Une liste de véhicules correspondants.
     */
    List<Vehicle> findByCategorie(VehicleCategory categorie);
}
