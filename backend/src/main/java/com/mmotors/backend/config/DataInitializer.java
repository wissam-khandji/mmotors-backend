package com.mmotors.backend.config;

import com.mmotors.backend.entities.*;
import com.mmotors.backend.repositories.UserRepository;
import com.mmotors.backend.repositories.VehicleRepository;
import com.mmotors.backend.repositories.OptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import java.nio.charset.StandardCharsets;

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
    private final OptionRepository optionRepository;
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
                .imagePath("https://cdn.automobile-propre.com/cdn-cgi/image/width=384,format=auto,fit=scale-down/https://cdn.automobile-propre.com/uploads/2013/08/Tesla-Model-3-18.jpg")
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
                .imagePath("https://static.moniteurautomobile.be/imgcontrol/images_tmp/clients/moniteur/c680-d465/content/medias/images/news/43000/200/0/i4-1.jpg")
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
                .imagePath("https://www.peugeot.be/content/dam/peugeot/master/b2c/our-range/showroom/208/immersive-update/e-208/PEUGEOT_E208_ORDER_2_test2.jpg")
                .build();
            vehicleRepository.save(v3);
        }

        // 3. Initialisation des Options avec prix
        if (optionRepository.count() == 0) {
            System.out.println("Initialisation des options avec prix bidons...");
            
            optionRepository.save(new Option(null, "Assurance Vol", 20.0, "SERVICE"));
            optionRepository.save(new Option(null, "Assistance 24/7", 30.0, "SERVICE"));
            optionRepository.save(new Option(null, "Entretien Premium", 20.0, "SERVICE"));
            optionRepository.save(new Option(null, "Pack Connectivité", 30.0, "EQUIPEMENT"));
            optionRepository.save(new Option(null, "Extension Garantie 2 ans", 50.0, "SERVICE"));
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

