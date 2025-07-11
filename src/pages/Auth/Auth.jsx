import React, { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { useNotification } from '../../contexts/NotificationContext';
import RegisterForm from '../../components/RegisterForm';
import LoginForm from '../../components/LoginForm';
import CompleteProfile from '../../components/CompleteProfile';

const Auth = ({ onAuthSuccess }) => {
  const { showNotification } = useNotification();
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'complete-profile'
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Solo intenta obtener el usuario si hay token
      if (!authService.getToken()) {
        setLoading(false);
        return;
      }
      const user = await authService.getCurrentUser();
      if (user) {
        // Verificar si el token es válido
        const isValid = await authService.verifyToken();
        if (isValid) {
          setCurrentUser(user);

          // Si el perfil no está completo, mostrar formulario de completar perfil
          if (!user.profileCompleted) {
            setCurrentView('complete-profile');
          } else {
            onAuthSuccess(user);
          }
        } else {
          // Token inválido, limpiar
          authService.logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSuccess = (result) => {
    setCurrentUser(result.user);
    setCurrentView('complete-profile');
  };

  const handleLoginSuccess = (result) => {
    setCurrentUser(result.user);
    
    if (!result.user.profileCompleted) {
      setCurrentView('complete-profile');
    } else {
      onAuthSuccess(result.user);
    }
  };

  const handleProfileComplete = async () => {
    // Recargar usuario actualizado
    const updatedUser = await authService.getCurrentUser();
    setCurrentUser(updatedUser);
    onAuthSuccess(updatedUser);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentView('login');
    showNotification('Sesión cerrada', 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 glow">⚔️</div>
          <h2 className="text-2xl font-bold text-gradient">Verificando sesión...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 glow">⚔️</div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Albion Group Manager
          </h1>
          <p className="text-gray-400">
            Organiza grupos y eventos para Albion Online
          </p>
        </div>

        {/* Auth Forms */}
        <div className="card">
          {currentView === 'login' && (
            <LoginForm
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={() => setCurrentView('register')}
            />
          )}

          {currentView === 'register' && (
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={() => setCurrentView('login')}
            />
          )}

          {currentView === 'complete-profile' && currentUser && (
            <CompleteProfile
              user={currentUser}
              onComplete={handleProfileComplete}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Albion Group Manager v1.0 - Organiza tus actividades
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth; 