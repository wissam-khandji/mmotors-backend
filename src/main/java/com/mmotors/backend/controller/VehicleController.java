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
     * Récupère un véhicule par son identifiant.
     * 
     * @param id L'ID du véhicule.
     * @return Le véhicule trouvé.
     */
    @GetMapping("/{id}")
    public Vehicle getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id);
    }

    /**
     * Crée un nouveau véhicule.
     * 
     * @param vehicle Les données du véhicule à créer.
     * @return Le véhicule créé.
     */
    @PostMapping
    public Vehicle createVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.createVehicle(vehicle);
    }

    /**
     * Met à jour un véhicule existant.
     * 
     * @param id L'ID du véhicule à modifier.
     * @param vehicle Les nouvelles données.
     * @return Le véhicule mis à jour.
     */
    @PutMapping("/{id}")
    public Vehicle updateVehicle(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        return vehicleService.updateVehicle(id, vehicle);
    }

    /**
     * Supprime un véhicule du parc.
     * 
     * @param id L'ID du véhicule à supprimer.
     */
    @DeleteMapping("/{id}")
    public void deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
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
