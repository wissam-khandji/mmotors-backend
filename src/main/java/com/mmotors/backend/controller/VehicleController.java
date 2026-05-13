package com.mmotors.backend.controller;

import com.mmotors.backend.entities.Vehicle;
import com.mmotors.backend.entities.VehicleCategory;
import com.mmotors.backend.services.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Contrôleur REST pour la gestion des véhicules.
 */
@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    /**
     * Récupère la liste des véhicules.
     * 
     * @param categorie Paramètre optionnel pour filtrer par catégorie.
     * @return Une liste de véhicules.
     */
    @GetMapping
    public List<Vehicle> getVehicles(@RequestParam(required = false) VehicleCategory categorie) {
        return vehicleService.getAllVehicles(Optional.ofNullable(categorie));
    }

    /**
     * Bascule la catégorie du véhicule spécifié.
     * 
     * @param id L'ID du véhicule à modifier.
     * @return Le véhicule mis à jour.
     */
    @PatchMapping("/{id}/switch")
    public Vehicle switchVehicleCategory(@PathVariable Long id) {
        return vehicleService.switchCategory(id);
    }
}
