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
    public Document ajouterDocument(Long dossierId, String nom, String chemin) {
        Dossier dossier = dossierRepository.findById(dossierId)
                .orElseThrow(() -> new RuntimeException("Dossier non trouvé"));

        Document doc = new Document();
        doc.setNomFichier(nom);
        doc.setCheminFichier(chemin);
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
        return dossierRepository.save(dossier);
    }

    public List<Dossier> getDossiersByUtilisateur(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return dossierRepository.findByUser(user);
    }
}
