package com.mmotors.backend.services;

import com.mmotors.backend.entities.User;
import com.mmotors.backend.entities.UserRole;
import com.mmotors.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service gérant la logique liée aux utilisateurs et à l'authentification.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Enregistre un nouvel utilisateur avec hachage du mot de passe.
     * 
     * @param user L'utilisateur à créer.
     * @return L'utilisateur enregistré.
     */
    public User register(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Un utilisateur existe déjà avec cet email.");
        }
        
        // Hachage du mot de passe
        user.setMotDePasse(passwordEncoder.encode(user.getMotDePasse()));
        
        // Attribution d'un rôle par défaut si non spécifié
        if (user.getRole() == null) {
            user.setRole(UserRole.CLIENT);
        }
        
        return userRepository.save(user);
    }

    /**
     * Récupère un utilisateur par son email.
     * 
     * @param email L'email.
     * @return L'utilisateur trouvé.
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Vérifie les identifiants pour la connexion.
     * 
     * @param email L'email.
     * @param plainPassword Le mot de passe en clair.
     * @return L'utilisateur si authentifié.
     */
    public User login(String email, String plainPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect."));
        
        if (!passwordEncoder.matches(plainPassword, user.getMotDePasse())) {
            throw new RuntimeException("Email ou mot de passe incorrect.");
        }
        
        return user;
    }
}
