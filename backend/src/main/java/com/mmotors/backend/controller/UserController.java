package com.mmotors.backend.controllers;

import com.mmotors.backend.entities.User;
import com.mmotors.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Contrôleur pour la gestion des utilisateurs (Admin).
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * Récupère tous les utilisateurs enregistrés.
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
