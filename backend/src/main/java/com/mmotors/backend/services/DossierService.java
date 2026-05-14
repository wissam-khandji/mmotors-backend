package com.mmotors.backend.services;

import com.mmotors.backend.entities.*;
import com.mmotors.backend.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service gérant la logique des dossiers d'achat et de location.
 */
@Service
@RequiredArgsConstructor
public class DossierService {

    private final DossierRepository dossierRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final OptionRepository optionRepository;
    private final DocumentRepository documentRepository;

    /**
     * Crée un nouveau dossier avec utilisateur, véhicule et options.
     */
    @Transactional
    public Dossier creerDossier(Long userId, Long vehicleId, List<Long> optionIds, DossierType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Véhicule non trouvé"));
        
        List<Option> options = optionRepository.findAllById(optionIds);

        Dossier dossier = new Dossier();
        dossier.setUser(user);
        dossier.setVehicle(vehicle);
        dossier.setOptions(options);
        dossier.setType(type);
        dossier.setStatut(DossierStatut.EN_ATTENTE);
        dossier.setDateCreation(LocalDateTime.now());

        return dossierRepository.save(dossier);
    }

    /**
     * Ajoute un document justificatif à un dossier existant.
     */
    @Transactional
    public Document ajouterDocument(Long dossierId, String nom, String content) {
        Dossier dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("Dossier non trouvé"));

        Document doc = new Document();
        doc.setNomFichier(nom);
        doc.setContent(content);
        doc.setDossier(dossier);

        return documentRepository.save(doc);
    }

    /**
     * Modifie le statut d'un dossier (Validation/Refus par un admin).
     */
    @Transactional
    public Dossier modifierStatut(Long id, DossierStatut nouveauStatut) {
        Dossier dossier = dossierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dossier non trouvé"));
        
        dossier.setStatut(nouveauStatut);

        // Si le dossier est validé, on met à jour le statut du véhicule
        if (nouveauStatut == DossierStatut.VALIDE) {
            Vehicle vehicle = dossier.getVehicle();
            if (vehicle.getCategorie() == VehicleCategory.LOCATION) {
                vehicle.setStatut(VehicleStatus.LOUE);
            } else {
                vehicle.setStatut(VehicleStatus.VENDU);
            }
            vehicleRepository.save(vehicle);
        }

        return dossierRepository.save(dossier);
    }

    public List<Dossier> getDossiersWithFilters(Long userId, Long vehicleId) {
        if (userId != null && vehicleId != null) {
            User user = userRepository.findById(userId).orElse(null);
            Vehicle vehicle = vehicleRepository.findById(vehicleId).orElse(null);
            if (user != null && vehicle != null) {
                // On pourrait ajouter une méthode au repository pour ce cas précis
                return dossierRepository.findAll().stream()
                        .filter(d -> d.getUser().getId().equals(userId) && d.getVehicle().getId().equals(vehicleId))
                        .collect(java.util.stream.Collectors.toList());
            }
        } else if (userId != null) {
            return getDossiersByUtilisateur(userId);
        } else if (vehicleId != null) {
            // Filtrage par véhicule
            return dossierRepository.findAll().stream()
                    .filter(d -> d.getVehicle().getId().equals(vehicleId))
                    .collect(java.util.stream.Collectors.toList());
        }
        return getAllDossiers();
    }

    public List<Dossier> getDossiersByUtilisateur(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return dossierRepository.findByUser(user);
    }

    public List<Dossier> getAllDossiers() {
        return dossierRepository.findAll();
    }
}
