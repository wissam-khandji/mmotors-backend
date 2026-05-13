package com.mmotors.backend.controller;

import com.mmotors.backend.entities.Document;
import com.mmotors.backend.entities.Dossier;
import com.mmotors.backend.entities.DossierStatut;
import com.mmotors.backend.entities.DossierType;
import com.mmotors.backend.services.DossierService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour la gestion des dossiers clients.
 */
@RestController
@RequestMapping("/api/dossiers")
@RequiredArgsConstructor
public class DossierController {

    private final DossierService dossierService;

    /**
     * Création d'un dossier d'achat ou location.
     */
    @PostMapping
    public Dossier creerDossier(@RequestBody DossierRequest request) {
        return dossierService.creerDossier(
                request.getUserId(), 
                request.getVehicleId(), 
                request.getOptionIds(), 
                request.getType()
        );
    }

    /**
     * Récupère tous les dossiers d'un utilisateur spécifique.
     */
    @GetMapping("/utilisateur/{userId}")
    public List<Dossier> getDossiersParUtilisateur(@PathVariable Long userId) {
        return dossierService.getDossiersByUtilisateur(userId);
    }

    /**
     * Simule l'ajout d'un document à un dossier.
     */
    @PostMapping("/{id}/documents")
    public Document ajouterDocument(@PathVariable Long id, @RequestBody DocumentRequest request) {
        return dossierService.ajouterDocument(id, request.getNom(), request.getChemin());
    }

    /**
     * Permet de modifier le statut d'un dossier (Admin).
     */
    @PatchMapping("/{id}/statut")
    public Dossier modifierStatut(@PathVariable Long id, @RequestParam DossierStatut statut) {
        return dossierService.modifierStatut(id, statut);
    }

    @Data
    public static class DossierRequest {
        private Long userId;
        private Long vehicleId;
        private List<Long> optionIds;
        private DossierType type;
    }

    @Data
    public static class DocumentRequest {
        private String nom;
        private String chemin;
    }
}
