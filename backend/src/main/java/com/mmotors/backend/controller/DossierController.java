package com.mmotors.backend.controllers;

import com.mmotors.backend.entities.Document;
import com.mmotors.backend.entities.Dossier;
import com.mmotors.backend.entities.DossierStatut;
import com.mmotors.backend.entities.DossierType;
import com.mmotors.backend.services.DossierService;
import com.mmotors.backend.services.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

/**
 * Contrôleur pour la gestion des dossiers clients.
 */
@RestController
@RequestMapping("/api/dossiers")
@RequiredArgsConstructor
public class DossierController {

    private final DossierService dossierService;
    private final UserService userService;

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
     * Récupère les dossiers.
     * Si userId est présent, filtre par utilisateur.
     * Si vehicleId est présent, filtre par véhicule.
     * Sinon, renvoie tous les dossiers (Admin).
     */
    @GetMapping
    public List<Dossier> getDossiers(
            @RequestParam(required = false) Long userId, 
            @RequestParam(required = false) Long vehicleId,
            Principal principal) {
        
        // Sécurité : Un client ne peut voir que SES propres dossiers
        if (principal != null) {
            com.mmotors.backend.entities.User currentUser = userService.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            
            if (currentUser.getRole() == com.mmotors.backend.entities.UserRole.CLIENT) {
                // Pour un client, on force le filtre sur son propre ID
                return dossierService.getDossiersByUtilisateur(currentUser.getId());
            }
        }

        return dossierService.getDossiersWithFilters(userId, vehicleId);
    }

    /**
     * Récupère tous les dossiers d'un utilisateur spécifique (via PathVariable).
     * Conservé pour compatibilité si nécessaire, mais getDossiers est plus flexible.
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
        return dossierService.ajouterDocument(id, request.getNom(), request.getContent());
    }

    /**
     * Permet de modifier le statut d'un dossier (Admin).
     * Prend un String statut en entrée pour plus de flexibilité.
     */
    @PatchMapping("/{id}/statut")
    public Dossier modifierStatut(@PathVariable Long id, @RequestParam String statut) {
        DossierStatut dossierStatut = DossierStatut.valueOf(statut.toUpperCase());
        return dossierService.modifierStatut(id, dossierStatut);
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
        private String content;
    }
}
