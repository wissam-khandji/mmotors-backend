package com.mmotors.backend.controllers;

import com.mmotors.backend.entities.User;
import com.mmotors.backend.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Contrôleur gérant l'authentification.
 */
@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
public class AuthController {

    private final UserService userService;
    private final com.mmotors.backend.config.JwtUtils jwtUtils;

    /**
     * Enregistre un nouvel utilisateur.
     */
    @PostMapping("/api/auth/register")
    public User register(@RequestBody Map<String, String> payload) {
        User user = new User();
        user.setNom(payload.get("nom"));
        user.setPrenom(payload.get("prenom"));
        user.setEmail(payload.get("email"));
        user.setMotDePasse(payload.get("motDePasse"));
        return userService.register(user);
    }

    /**
     * Connecte un utilisateur et retourne un token JWT.
     */
    @PostMapping("/api/auth/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        User user = userService.login(loginRequest.getEmail(), loginRequest.getMotDePasse());
        // Utilisation de user.getRole().toString() ou name()
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, user);
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private User user;
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

