import React, { useState } from 'react';
import { User, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';
import { useNotification } from '../contexts/NotificationContext';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    albionNick: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.albionNick.trim()) {
      showNotification('El nick de Albion es requerido', 'error');
      return false;
    }

    if (formData.albionNick.trim().length < 3) {
      showNotification('El nick de Albion debe tener al menos 3 caracteres', 'error');
      return false;
    }

    if (formData.password.length < 6) {
      showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await authService.register({
        albionNick: formData.albionNick.trim(),
        password: formData.password
      });

      showNotification('Registro exitoso! Completa tu perfil para continuar', 'success');
      
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      showNotification(error.response?.data?.error || 'Error en el registro', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">Crear Cuenta</h2>
        <p className="text-gray-400">
          Regístrate usando tu nick de Albion Online
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
          <p className="text-xs text-gray-500 mt-1">
            Este será tu nombre de usuario en la aplicación
          </p>
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
              placeholder="Mínimo 6 caracteres"
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

        {/* Confirmar Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className="input pl-10 pr-10 w-full"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Botón de Registro */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>

        {/* Enlace a Login */}
        <div className="text-center">
          <p className="text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </form>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
        <h4 className="text-sm font-semibold text-blue-400 mb-2">Después del registro:</h4>
        <ul className="text-xs text-gray-300 space-y-1">
          <li>• Completa tu perfil con roles y recursos</li>
          <li>• Únete a grupos y eventos</li>
          <li>• Usa la calculadora de loot</li>
        </ul>
      </div>
    </div>
  );
};

export default RegisterForm; 