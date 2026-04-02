import axios from 'axios';
import keycloak from '../utils/KeycloakConfig';

const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7127/api',
});

// Request interceptor for adding the bearer token
ApiClient.interceptors.request.use(
  (config) => {
    // CRITICAL: Ensure we get a string token, not an object
    const token = localStorage.getItem('token');
    
    if (token && typeof token === 'string' && token.includes('.')) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      console.warn("Invalid token format detected in ApiClient:", token);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

ApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized access - please log in again.');
    }
    return Promise.reject(error);
  }
);

export default ApiClient;
