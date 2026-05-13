package com.mmotors.backend.services;

import com.mmotors.backend.entities.Vehicle;
import com.mmotors.backend.entities.VehicleCategory;
import com.mmotors.backend.repositories.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service gérant la logique métier des véhicules.
 */
@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    /**
     * Liste tous les véhicules, avec un filtre optionnel par catégorie.
     * 
     * @param categorie La catégorie optionnelle pour le filtrage.
     * @return La liste des véhicules filtrée ou complète.
     */
    public List<Vehicle> getAllVehicles(Optional<VehicleCategory> categorie) {
        return categorie
                .map(vehicleRepository::findByCategorie)
                .orElseGet(vehicleRepository::findAll);
    }

    /**
     * Bascule la catégorie d'un véhicule (VENTE -> LOCATION ou vice-versa).
     * 
     * @param id L'identifiant du véhicule.
     * @return Le véhicule mis à jour.
     * @throws RuntimeException si le véhicule n'est pas trouvé.
     */
    @Transactional
    public Vehicle switchCategory(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé avec l'id : " + id));

        // Logique de bascule
        if (vehicle.getCategorie() == VehicleCategory.VENTE) {
            vehicle.setCategorie(VehicleCategory.LOCATION);
        } else {
            vehicle.setCategorie(VehicleCategory.VENTE);
        }

        return vehicleRepository.save(vehicle);
    }
}
