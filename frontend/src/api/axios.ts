import axios from 'axios';

/**
 * Instance Axios configurée pour communiquer avec l'API Spring Boot
 */
const api = axios.create({
  // On utilise la variable d'environnement définie dans Vercel
  // Si elle n'existe pas (en local), on utilise localhost par défaut
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur de requête pour injecter le token JWT automatiquement
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
