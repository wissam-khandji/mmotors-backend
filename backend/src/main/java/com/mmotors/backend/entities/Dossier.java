package com.mmotors.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entité centrale regroupant un client, un véhicule et les options choisies.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dossier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime dateCreation;

    @Enumerated(EnumType.STRING)
    private DossierType type;

    @Enumerated(EnumType.STRING)
    private DossierStatut statut;

    /**
     * Relation ManyToOne : Un dossier est créé par un seul utilisateur (client).
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Relation ManyToOne : Un dossier concerne un seul véhicule précis.
     */
    @ManyToOne
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    /**
     * Relation ManyToMany : Un dossier peut avoir plusieurs options, 
     * et une option peut être liée à plusieurs dossiers.
     * Utilisation d'une table de jointure explicite.
     */
    @ManyToMany
    @JoinTable(
        name = "dossier_options",
        joinColumns = @JoinColumn(name = "dossier_id"),
        inverseJoinColumns = @JoinColumn(name = "option_id")
    )
    private List<Option> options = new ArrayList<>();
}
