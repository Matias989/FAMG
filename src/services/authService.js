import api from '../utils/api';

export const authService = {
  // Registro de usuario
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  },

  // Login de usuario
  async login(albionNick, password) {
    try {
      const response = await api.post('/auth/login', { albionNick, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('token');
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!this.getToken();
  },

  // Obtener perfil del usuario (del backend)
  async getProfile() {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  },

  // Obtener usuario actual (compatibilidad)
  async getCurrentUser() {
    try {
      return await this.getProfile();
    } catch (error) {
      return null;
    }
  },

  // Actualizar perfil del usuario
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },

  // Buscar usuarios por nick de Albion
  async searchUsers(searchTerm) {
    try {
      const response = await api.get(`/auth/users/search?q=${encodeURIComponent(searchTerm)}`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw error;
    }
  },

  // Verificar token
  async verifyToken() {
    try {
      const response = await api.get('/auth/verify');
      return response.data.valid;
    } catch (error) {
      console.error('Error al verificar token:', error);
      return false;
    }
  }
}; 