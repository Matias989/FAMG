import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
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

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token es inválido (401), limpiar localStorage y redirigir
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      
      // Redirigir a auth solo si no estamos ya en la página de auth
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
    
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export default api; 