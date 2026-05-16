package com.mmotors.backend.services;

import com.mmotors.backend.entities.*;
import com.mmotors.backend.repositories.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DossierServiceTest {

    @Mock
    private DossierRepository dossierRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private OptionRepository optionRepository;

    @Mock
    private DocumentRepository documentRepository;

    @InjectMocks
    private DossierService dossierService;

    @Test
    @DisplayName("creerDossier_Success : Vérifie l'intégrité relationnelle lors de la création d'un dossier")
    void creerDossier_Success() {
        // Given
        User user = User.builder().id(1L).email("client@mmotors.com").build();

        Vehicle vehicle = Vehicle.builder()
                .id(1L)
                .marque("Tesla")
                .modele("Model 3")
                .build();

        Dossier dossierSaved = new Dossier();
        dossierSaved.setId(100L);
        dossierSaved.setUser(user);
        dossierSaved.setVehicle(vehicle);
        dossierSaved.setStatut(DossierStatut.EN_ATTENTE);

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(vehicle));
        when(optionRepository.findAllById(any())).thenReturn(Collections.emptyList());
        when(dossierRepository.save(any(Dossier.class))).thenReturn(dossierSaved);

        // When
        Dossier result = dossierService.creerDossier(1L, 1L, Collections.emptyList(), DossierType.ACHAT);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(100L);
        assertThat(result.getUser().getEmail()).isEqualTo("client@mmotors.com");
        assertThat(result.getVehicle().getMarque()).isEqualTo("Tesla");
        assertThat(result.getStatut()).isEqualTo(DossierStatut.EN_ATTENTE);
        
        verify(userRepository).findById(1L);
        verify(vehicleRepository).findById(1L);
        verify(dossierRepository).save(any(Dossier.class));
    }

    @Test
    @DisplayName("creerDossier_UserNotFound : Vérifie que l'exception est levée si l'user n'existe pas")
    void creerDossier_UserNotFound() {
        // Given
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> 
            dossierService.creerDossier(999L, 1L, Collections.emptyList(), DossierType.ACHAT)
        );
    }

    @Test
    @DisplayName("creerDossier_VehicleNotFound : Vérifie que l'exception est levée si le véhicule n'existe pas")
    void creerDossier_VehicleNotFound() {
        // Given
        User user = User.builder().id(1L).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(vehicleRepository.findById(999L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(RuntimeException.class, () -> 
            dossierService.creerDossier(1L, 999L, Collections.emptyList(), DossierType.ACHAT)
        );
    }

    @Test
    @DisplayName("ajouterDocument_Success : Vérifie la liaison d'un document à un dossier")
    void ajouterDocument_Success() {
        // Given
        Dossier dossier = new Dossier();
        dossier.setId(50L);
        when(dossierRepository.findById(50L)).thenReturn(Optional.of(dossier));

        Document documentSaved = new Document();
        documentSaved.setNomFichier("Contrat.pdf");
        when(documentRepository.save(any(Document.class))).thenReturn(documentSaved);

        // When
        Document result = dossierService.ajouterDocument(50L, "Contrat.pdf", "BASE64_CONTENT");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getNomFichier()).isEqualTo("Contrat.pdf");
        verify(documentRepository).save(any(Document.class));
    }

    @Test
    @DisplayName("modifierStatut_Success : Vérifie que le statut est correctement mis à jour par l'admin")
    void modifierStatut_Success() {
        // Given
        Dossier dossier = new Dossier();
        dossier.setId(1L);
        dossier.setStatut(DossierStatut.EN_ATTENTE);
        
        // On crée un faux véhicule lié pour éviter le NullPointerException
        Vehicle vehicle = Vehicle.builder()
                .id(1L)
                .categorie(VehicleCategory.VENTE)
                .statut(VehicleStatus.DISPONIBLE)
                .build();
        dossier.setVehicle(vehicle);
        
        when(dossierRepository.findById(1L)).thenReturn(Optional.of(dossier));
        when(dossierRepository.save(any(Dossier.class))).thenAnswer(inv -> inv.getArgument(0));

        // When
        Dossier result = dossierService.modifierStatut(1L, DossierStatut.VALIDE);

        // Then
        assertThat(result.getStatut()).isEqualTo(DossierStatut.VALIDE);
        verify(dossierRepository).save(dossier);
    }
}