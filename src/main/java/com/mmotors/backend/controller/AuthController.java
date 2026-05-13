package com.mmotors.backend.controller;

import com.mmotors.backend.entities.User;
import com.mmotors.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Contrôleur gérant l'authentification.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * Enregistre un nouvel utilisateur.
     * 
     * @param user Les données de l'utilisateur.
     * @return L'utilisateur créé.
     */
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    /**
     * Connecte un utilisateur.
     * 
     * @param loginRequest Objet contenant email et mot de passe.
     * @return L'utilisateur connecté.
     */
    @PostMapping("/login")
    public User login(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest.getEmail(), loginRequest.getMotDePasse());
    }

    /**
     * DTO simple pour la requête de connexion.
     */
    @lombok.Data
    public static class LoginRequest {
        private String email;
        private String motDePasse;
    }
}
