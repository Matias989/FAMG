import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { useNotification } from '../contexts/NotificationContext';

const LoginForm = ({ onSuccess, onSwitchToRegister }) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    albionNick: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.albionNick.trim() || !formData.password) {
      showNotification('Nick de Albion y contraseña son requeridos', 'error');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.login(formData.albionNick.trim(), formData.password);
      
      showNotification('¡Bienvenido de vuelta!', 'success');
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error en el login', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">Iniciar Sesión</h2>
        <p className="text-gray-400">
          Accede con tu nick de Albion Online
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nick de Albion */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nick de Albion Online
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              name="albionNick"
              value={formData.albionNick}
              onChange={handleChange}
              placeholder="Tu nick en Albion"
              className="input pl-10 w-full"
              required
            />
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              className="input pl-10 pr-10 w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Botón de Login */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>

        {/* Enlace a Registro */}
        <div className="text-center">
          <p className="text-gray-400">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Regístrate
            </button>
          </p>
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
        <h4 className="text-sm font-semibold text-green-400 mb-2">¿Olvidaste tu contraseña?</h4>
        <p className="text-xs text-gray-300">
          Por el momento, contacta con un administrador para recuperar tu cuenta.
        </p>
      </div>
    </div>
  );
};

export default LoginForm; 