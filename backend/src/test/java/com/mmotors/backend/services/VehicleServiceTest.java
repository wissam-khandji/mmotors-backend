package com.mmotors.backend.services;

import com.mmotors.backend.entities.Vehicle;
import com.mmotors.backend.entities.VehicleCategory;
import com.mmotors.backend.entities.VehicleStatus;
import com.mmotors.backend.repositories.VehicleRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

/**
 * Tests unitaires pour VehicleService.
 * Cette classe valide la logique métier liée au parc automobile (M-Motors).
 */
@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    @Test
    @DisplayName("Liste : Retourne tous les véhicules sans filtre")
    void findAll_ShouldReturnAllVehicles() {
        // GIVEN
        Vehicle v1 = new Vehicle(1L, "Tesla", "Model 3", 10000, 35000, VehicleCategory.VENTE, VehicleStatus.DISPONIBLE);
        Vehicle v2 = new Vehicle(2L, "BMW", "i4", 5000, 45000, VehicleCategory.LOCATION, VehicleStatus.DISPONIBLE);
        given(vehicleRepository.findAll()).willReturn(Arrays.asList(v1, v2));

        // WHEN
        List<Vehicle> result = vehicleService.getAllVehicles(Optional.empty());

        // THEN
        assertThat(result).hasSize(2);
        verify(vehicleRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Filtre : Retourne uniquement les véhicules de la catégorie spécifiée")
    void findByCategory_ShouldReturnFilteredVehicles() {
        // GIVEN
        Vehicle v1 = new Vehicle(1L, "Tesla", "Model 3", 10000, 35000, VehicleCategory.VENTE, VehicleStatus.DISPONIBLE);
        given(vehicleRepository.findByCategorie(VehicleCategory.VENTE)).willReturn(List.of(v1));

        // WHEN
        List<Vehicle> result = vehicleService.getAllVehicles(Optional.of(VehicleCategory.VENTE));

        // THEN
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCategorie()).isEqualTo(VehicleCategory.VENTE);
        verify(vehicleRepository, times(1)).findByCategorie(VehicleCategory.VENTE);
    }

    @Test
    @DisplayName("Bascule : VENTE vers LOCATION avec sauvegarde")
    void switchCategory_ShouldChangeVenteToLocation() {
        // GIVEN : Un véhicule initialement en VENTE
        Vehicle vehicle = new Vehicle(1L, "Tesla", "Model 3", 10000, 35000, VehicleCategory.VENTE, VehicleStatus.DISPONIBLE);
        given(vehicleRepository.findById(1L)).willReturn(Optional.of(vehicle));
        given(vehicleRepository.save(any(Vehicle.class))).willReturn(vehicle);

        // WHEN : On déclenche la bascule
        Vehicle updatedVehicle = vehicleService.switchCategory(1L);

        // THEN : La catégorie doit être LOCATION et le repository doit avoir sauvegardé
        assertThat(updatedVehicle.getCategorie()).isEqualTo(VehicleCategory.LOCATION);
        verify(vehicleRepository).save(vehicle);
        
        // Explication orale : Ce test prouve que la règle métier de modification d'état est respectée
        // et qu'on ne se contente pas de modifier l'objet, on persiste le changement via le repository.
    }

    @Test
    @DisplayName("Bascule : LOCATION vers VENTE avec sauvegarde")
    void switchCategory_ShouldChangeLocationToVente() {
        // GIVEN
        Vehicle vehicle = new Vehicle(1L, "BMW", "i4", 5000, 45000, VehicleCategory.LOCATION, VehicleStatus.DISPONIBLE);
        given(vehicleRepository.findById(1L)).willReturn(Optional.of(vehicle));
        given(vehicleRepository.save(any(Vehicle.class))).willReturn(vehicle);

        // WHEN
        Vehicle updatedVehicle = vehicleService.switchCategory(1L);

        // THEN
        assertThat(updatedVehicle.getCategorie()).isEqualTo(VehicleCategory.VENTE);
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    @DisplayName("Bascule : Erreur levée si l'id véhicule n'existe pas")
    void switchCategory_ShouldThrowException_WhenVehicleNotFound() {
        // GIVEN
        given(vehicleRepository.findById(999L)).willReturn(Optional.empty());

        // WHEN & THEN
        assertThatThrownBy(() -> vehicleService.switchCategory(999L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Véhicule non trouvé avec l'id : 999");
        
        // On vérifie que save() n'a jamais été appelé car l'exception arrête le flux
        verify(vehicleRepository, never()).save(any());
        
        // Explication orale : On teste la robustesse de l'application face à des données erronées.
    }
}
