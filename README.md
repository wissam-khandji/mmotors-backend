#  M-Motors - Plateforme de Gestion de Flotte Automobile

M-Motors est une application Fullstack moderne conçue pour un mandataire automobile. Elle permet de gérer un catalogue de véhicules, de configurer des options de personnalisation et de traiter des demandes de Location Longue Durée (LLD) ou de Vente Directe.

##  Fonctionnalités Clés

###  Espace Client
- **Inscription & Connexion** : Système sécurisé avec hachage BCrypt et tokens JWT.
- **Catalogue Dynamique** : Visualisation des véhicules avec filtres par catégorie (Vente/Location).
- **Configuration d'Options** : Choix d'options (Peinture, Entretien, Assistance) avec calcul du prix en temps réel.
- **Suivi des Demandes** : Interface dédiée pour suivre l'état d'avancement des dossiers (En attente, Validé, Refusé).

###  Interface Administration
- **Gestion du Parc (CRUD)** : Ajout, modification et suppression de véhicules (gestion des images en Base64).
- **Gestion des Dossiers** : Système de validation/refus des demandes clients.
- **Automatisation** : Mise à jour automatique du statut du véhicule (ex: passe en "Vendu" ou "Loué" dès validation du dossier).
- **KPIs** : Indicateurs visuels sur l'état de la flotte et le taux d'utilisation.

##  Stack Technique

- **Backend** : Spring Boot 3.3 (Java 17), Spring Security, JWT, Hibernate/JPA.
- **Frontend** : React 18, TypeScript, Tailwind CSS 4, Vite, Motion.
- **Base de données** : H2 (Base de données relationnelle en mémoire pour la démo).
- **Communication** : API REST avec Axios.

##  Installation et Lancement

### Prérequis
- Java 17+
- Node.js 18+

### Lancement du Backend
1. Accéder au dossier : `cd backend`
2. Lancer l'application : `./mvnw spring-boot:run`
3. L'API sera disponible sur `http://localhost:8080`

### Lancement du Frontend
1. Accéder au dossier : `cd frontend`
2. Installer les dépendances : `npm install`
3. Lancer le projet : `npm run dev`
4. L'application sera accessible sur `http://localhost:5173`

##  Identifiants de Test

| Rôle | Email | Mot de passe |
| :--- | :--- | :--- |
| **Admin** | `admin@mmotors.com` | `admin123` |
| **Client** | `jean.dupont@test.com` | `client123` |

---
*Projet réalisé dans le cadre de l'examen de validation du Bloc 3.*
