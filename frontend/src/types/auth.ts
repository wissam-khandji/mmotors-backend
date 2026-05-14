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
    energie?: string;
    transmission?: string;
}

/**
 * Interface pour les options de personnalisation
 */
export interface VehicleOption {
  id: number;
  nom: string;
  prix: number;
  description?: string;
  type?: 'SERVICE' | 'EQUIPEMENT';
}

/**
 * Interface pour les dossiers de demande (location ou achat)
 */
export interface Dossier {
  id?: number;
  userId: number;
  vehicleId: number;
  user?: User;
  vehicle?: Vehicle;
  optionIds: number[];
  documents: string[]; // Stockage Base64 pour démo
  statut: 'EN_COURS' | 'VALIDE' | 'REFUSE' | 'EN_ATTENTE';
  createdAt?: string;
}
