package com.mmotors.backend.config;

import com.mmotors.backend.entities.*;
import com.mmotors.backend.repositories.UserRepository;
import com.mmotors.backend.repositories.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Initialisation des données au démarrage de l'application.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
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
            
            Vehicle v1 = new Vehicle();
            v1.setMarque("Tesla");
            v1.setModele("Model 3");
            v1.setPrix(35000);
            v1.setKilometrage(0);
            v1.setCategorie(VehicleCategory.VENTE);
            v1.setStatut(VehicleStatus.DISPONIBLE);
            vehicleRepository.save(v1);

            Vehicle v2 = new Vehicle();
            v2.setMarque("BMW");
            v2.setModele("i4");
            v2.setPrix(450); // Prix de location par jour par exemple
            v2.setKilometrage(5000);
            v2.setCategorie(VehicleCategory.LOCATION);
            v2.setStatut(VehicleStatus.DISPONIBLE);
            vehicleRepository.save(v2);

            Vehicle v3 = new Vehicle();
            v3.setMarque("Peugeot");
            v3.setModele("e-208");
            v3.setPrix(28000);
            v3.setKilometrage(1200);
            v3.setCategorie(VehicleCategory.VENTE);
            v3.setStatut(VehicleStatus.RESERVE);
            vehicleRepository.save(v3);
        }
    }
}
