/**
 * Interface simplifiée pour l'utilisateur
 */
export interface User {
  id: number;
  email: string;
  roles: string[];
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
  type: string;
  id: number;
  email: string;
  roles: string[];
}
