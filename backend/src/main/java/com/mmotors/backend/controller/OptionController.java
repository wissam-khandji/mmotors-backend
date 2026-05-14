package com.mmotors.backend.controllers;

import com.mmotors.backend.entities.Option;
import com.mmotors.backend.repositories.OptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Contrôleur pour la gestion des options de véhicules.
 */
@RestController
@RequestMapping("/api/options")
@RequiredArgsConstructor
public class OptionController {

    private final OptionRepository optionRepository;

    /**
     * Récupère la liste de toutes les options disponibles.
     */
    @GetMapping
    public List<Option> getAllOptions() {
        return optionRepository.findAll();
    }
}
