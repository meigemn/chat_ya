// src/api/apiClient.ts
import axios from 'axios';
const BASE_URL = 'https://localhost:7201/api'; 

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Interceptor para inyectar el token JWT en cada solicitud.
 * Esto asegura que GET /rooms y POST /rooms estén autenticados.
 */
apiClient.interceptors.request.use(
    (config) => {
        // Obtenemos el token del almacenamiento local (donde lo guarda useAuth.tsx)
        const token = localStorage.getItem('authToken'); 
        if (token) {
            // Añadimos la cabecera de autorización requerida por tu backend .NET
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;