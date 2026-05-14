/**
 * Interface simplifiée pour l'utilisateur
 */
export interface User {
  id: number;
  email: string;
  role: string;
}

/**
 * Structure de la requête de connexion
 */
export interface LoginRequest {
  email: string;
  motDePasse: string;
}

/**
 * Structure de la réponse reçue de l'API Spring Boot
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Interface pour les véhicules de la flotte
 */
export interface Vehicle {
    id?: number;
    marque: string;
    modele: string;
    annee: number;
    kilometrage: number;
    prix: number; // Sera le loyer mensuel ou le prix total
    categorie: 'LOCATION' | 'VENTE';
    imagePath?: string;
    statut?: 'DISPONIBLE' | 'LOUE' | 'VENDU';
}
