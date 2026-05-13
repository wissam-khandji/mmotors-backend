package com.mmotors.backend.repositories;

import com.mmotors.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository pour l'accès aux données des utilisateurs.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * Recherche un utilisateur par son adresse email.
     * 
     * @param email L'email de l'utilisateur.
     * @return Un optional contenant l'utilisateur s'il existe.
     */
    Optional<User> findByEmail(String email);
}
