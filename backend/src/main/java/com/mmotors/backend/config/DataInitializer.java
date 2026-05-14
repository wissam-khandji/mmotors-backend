package com.mmotors.backend.config;

import com.mmotors.backend.entities.*;
import com.mmotors.backend.repositories.UserRepository;
import com.mmotors.backend.repositories.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

/**
 * Initialisation des données au démarrage de l'application.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final com.mmotors.backend.repositories.OptionRepository optionRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialisation des Utilisateurs
        if (userRepository.count() == 0) {
            System.out.println("Initialisation des utilisateurs par défaut...");
            
            User admin = new User();
            admin.setNom("System");
            admin.setPrenom("Admin");
            admin.setEmail("admin@mmotors.com");
            admin.setMotDePasse(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            userRepository.save(admin);

            User client = new User();
            client.setNom("Dupont");
            client.setPrenom("Jean");
            client.setEmail("jean.dupont@test.com");
            client.setMotDePasse(passwordEncoder.encode("client123"));
            client.setRole(UserRole.CLIENT);
            userRepository.save(client);
        }

        // 2. Initialisation des Véhicules
        if (vehicleRepository.count() == 0) {
            System.out.println("Initialisation du catalogue de véhicules...");
            
            Vehicle v1 = Vehicle.builder()
                .marque("Tesla")
                .modele("Model 3")
                .prix(35000)
                .kilometrage(0)
                .annee(2023)
                .energie("Électrique")
                .transmission("Automatique")
                .categorie(VehicleCategory.VENTE)
                .statut(VehicleStatus.DISPONIBLE)
                .imagePath(encodeImageToBase64("tesla.jpg"))
                .build();
            vehicleRepository.save(v1);

            Vehicle v2 = Vehicle.builder()
                .marque("BMW")
                .modele("i4")
                .prix(450)
                .kilometrage(5000)
                .annee(2022)
                .energie("Électrique")
                .transmission("Automatique")
                .categorie(VehicleCategory.LOCATION)
                .statut(VehicleStatus.DISPONIBLE)
                .imagePath(encodeImageToBase64("bmw.jpg"))
                .build();
            vehicleRepository.save(v2);

            Vehicle v3 = Vehicle.builder()
                .marque("Peugeot")
                .modele("e-208")
                .prix(28000)
                .kilometrage(1200)
                .annee(2021)
                .energie("Électrique")
                .transmission("Automatique")
                .categorie(VehicleCategory.VENTE)
                .statut(VehicleStatus.RESERVE)
                .imagePath(encodeImageToBase64("peugeot.jpg"))
                .build();
            vehicleRepository.save(v3);
        }

        // 3. Initialisation des Options
        if (optionRepository.count() == 0) {
            System.out.println("Initialisation des options par défaut...");
            
            optionRepository.save(new Option(null, "Assurance Vol", 45.0, "SERVICE"));
            optionRepository.save(new Option(null, "Assistance 24/7", 15.0, "SERVICE"));
            optionRepository.save(new Option(null, "Entretien Premium", 80.0, "SERVICE"));
            optionRepository.save(new Option(null, "Pack Connectivité", 10.0, "EQUIPEMENT"));
        }
    }

    /**
     * Encode une image locale en chaîne Base64 pour le stockage en DB.
     * Les images doivent être placées dans src/main/resources/static/images/
     */
    private String encodeImageToBase64(String imageName) {
        try {
            // Chemin vers les ressources statiques
            Path path = Paths.get("src/main/resources/static/images/" + imageName);
            
            if (Files.exists(path)) {
                byte[] imageBytes = Files.readAllBytes(path);
                String base64 = Base64.getEncoder().encodeToString(imageBytes);
                // Préfixe pour affichage direct dans la balise <img src="...">
                return "data:image/jpeg;base64," + base64;
            } else {
                System.err.println("Image manquante : " + path.toAbsolutePath());
            }
        } catch (IOException e) {
            System.err.println("Erreur lors de l'encodage de l'image " + imageName + " : " + e.getMessage());
        }
        return ""; // Retourne une chaîne vide si l'image n'est pas trouvée ou erreur
    }
}
