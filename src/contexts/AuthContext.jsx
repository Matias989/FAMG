import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        // Verificar si el token es válido
        const isValid = await authService.verifyToken();
        if (isValid) {
          // Obtener SIEMPRE el perfil completo del backend
          const freshUser = await authService.getProfile();
          setUser(freshUser);
        } else {
          authService.logout();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (albionNick, password) => {
    try {
      const result = await authService.login(albionNick, password);
      // Obtener el perfil completo del backend
      const freshUser = await authService.getProfile();
      setUser(freshUser);
      return { ...result, user: freshUser };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      // Obtener el perfil completo del backend
      const freshUser = await authService.getProfile();
      setUser(freshUser);
      return { ...result, user: freshUser };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = await authService.updateProfile(profileData);
      // Obtener el perfil actualizado del backend
      const freshUser = await authService.getProfile();
      setUser(freshUser);
      return freshUser;
    } catch (error) {
      throw error;
    }
  };

  const searchUsers = async (searchTerm) => {
    try {
      return await authService.searchUsers(searchTerm);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    searchUsers,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 