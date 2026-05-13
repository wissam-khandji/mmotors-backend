# M-Motors — Backend API
### Système de Gestion Automobile

---

##  Présentation du Projet

**M-Motors** : Backend du projet M-Motors pour le bloc 3.

- Gestion du parc automobile (CRUD complet, filtrage par catégorie)
- Système d'authentification sécurisé (JWT — JSON Web Token)
- Gestion des dossiers clients (Location/Achat) avec suivi de documents
- Architecture multicouche (Controller, Service, Repository, Entity)

---

##  Stack Technique

| Technologie | Détail |
|---|---|
| **Langage** | Java 17 |
| **Framework** | Spring Boot 3.5.14 |
| **Sécurité** | Spring Security & JWT |
| **Base de données** | H2 (en mémoire, pour test rapide) |
| **Documentation** | Swagger / OpenAPI 3 |
| **Outils** | Maven, Lombok |

---

##  Installation et Lancement Rapide

**1. Cloner le repository :**
```bash
git clone https://github.com/wissam-khandji/mmotors-backend.git
```

**2. Lancer l'application** à la racine du projet :
```bash
./mvnw spring-boot:run
```

**3. Vérification :**
L'API sera accessible sur `http://localhost:8080`

---

##  Identifiants de Test (Auto-générés)

Au démarrage, l'application initialise automatiquement deux comptes pour faciliter l'évaluation :

| Rôle | Email | Mot de passe |
|---|---|---|
| Administrateur | `admin@mmotors.com` | `admin123` |
| Client | `jean.dupont@test.com` | `client123` |

>  Les mots de passe sont cryptés en base de données via **BCrypt**.

---

## 📖 Documentation Interactive (Swagger)

Une interface Swagger UI est disponible pour tester les endpoints sans outils externes :

 **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)**

**Procédure de test dans Swagger :**

1. Utilisez l'endpoint `POST /api/auth/login` avec les identifiants ci-dessus
2. Copiez le token reçu dans la réponse
3. Cliquez sur le bouton **"Authorize"**  en haut à droite et collez le token
4. Vous pouvez maintenant tester les routes protégées (ex : création de véhicule)

---

## 📊 Accès à la Base de Données

Visualisez les tables en temps réel via la console H2 :

| Paramètre | Valeur |
|---|---|
| **URL** | `http://localhost:8080/h2-console` |
| **JDBC URL** | `jdbc:h2:mem:mmotorsdb` |
| **User** | `sa` |
| **Password** | *(laisser vide)* |

---

##  Configuration CORS

L'API est pré-configurée pour accepter les requêtes provenant d'un client React (Vite) sur :

- `http://localhost:5173`
- `http://localhost:3000`
