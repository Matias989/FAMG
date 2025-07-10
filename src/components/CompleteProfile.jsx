import React, { useState } from 'react';
import { User, Plus, X, Save, Shield, Sword, Target, Heart, Star } from 'lucide-react';
import { authService } from '../services/authService';
import { useNotification } from '../contexts/NotificationContext';

const CompleteProfile = ({ user, onComplete }) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [profileData, setProfileData] = useState({
    roles: user?.roles || [],
    gathering: user?.gathering || {
      mineral: 'T1',
      madera: 'T1',
      fibra: 'T1',
      piedra: 'T1',
      piel: 'T1',
      pescado: 'T1'
    },
    guild: user?.guild || '',
    alliance: user?.alliance || '',
    city: user?.city || ''
  });

  const [newRole, setNewRole] = useState({
    type: '',
    isPrimary: false
  });

  const roleOptions = [
    { value: 'Tank', label: 'Tank', icon: Shield },
    { value: 'Curador', label: 'Curador', icon: Heart },
    { value: 'DPS Melee', label: 'DPS Melee', icon: Sword },
    { value: 'DPS Ranged', label: 'DPS Ranged', icon: Target },
    { value: 'Support', label: 'Support', icon: Star }
  ];

  const tierOptions = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8'];

  const handleAddRole = () => {
    if (!newRole.type) {
      showNotification('Selecciona un tipo de rol', 'error');
      return;
    }

    // Si es el primer rol, marcarlo como principal
    if (profileData.roles.length === 0) {
      newRole.isPrimary = true;
    }

    setProfileData({
      ...profileData,
      roles: [...profileData.roles, { ...newRole }]
    });

    setNewRole({
      type: '',
      isPrimary: false
    });
  };

  const handleRemoveRole = (index) => {
    const updatedRoles = profileData.roles.filter((_, i) => i !== index);
    
    // Si se eliminó el rol principal, marcar el primero como principal
    if (updatedRoles.length > 0 && !updatedRoles.some(role => role.isPrimary)) {
      updatedRoles[0].isPrimary = true;
    }

    setProfileData({
      ...profileData,
      roles: updatedRoles
    });
  };

  const handleSetPrimaryRole = (index) => {
    const updatedRoles = profileData.roles.map((role, i) => ({
      ...role,
      isPrimary: i === index
    }));

    setProfileData({
      ...profileData,
      roles: updatedRoles
    });
  };

  const handleSubmit = async () => {
    if (profileData.roles.length === 0) {
      showNotification('Debes agregar al menos un rol', 'error');
      return;
    }

    setLoading(true);
    try {
      await authService.updateProfile({
        ...profileData,
        profileCompleted: true
      });

      showNotification('Perfil completado exitosamente!', 'success');
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      showNotification('Error al completar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gradient mb-2">Bienvenido a Albion Group Manager</h3>
        <p className="text-gray-400">Configura tus roles para participar en actividades</p>
      </div>

      <div className="text-center">
        <div className="text-6xl mb-4">⚔️</div>
        <h4 className="text-lg font-semibold text-white mb-2">¡Hola, {user?.albionNick}!</h4>
        <p className="text-gray-400">Tu avatar por defecto es ⚔️</p>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="btn btn-primary"
        >
          Siguiente: Roles
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gradient mb-2">Roles de Combate</h3>
        <p className="text-gray-400">Agrega tus roles principales en Albion</p>
      </div>

      {/* Roles existentes */}
      {profileData.roles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-300">Roles configurados:</h4>
          {profileData.roles.map((role, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  role.isPrimary ? 'bg-gold-500/20 text-gold-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {role.isPrimary ? 'Principal' : 'Secundario'}
                </span>
                <span className="font-medium">{role.type}</span>
              </div>
              <div className="flex gap-2">
                {!role.isPrimary && (
                  <button
                    onClick={() => handleSetPrimaryRole(index)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Principal
                  </button>
                )}
                <button
                  onClick={() => handleRemoveRole(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Agregar nuevo rol */}
      <div className="p-4 border border-gray-600 rounded-lg">
        <h4 className="font-semibold text-gray-300 mb-4">Agregar nuevo rol:</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Rol</label>
            <select
              value={newRole.type}
              onChange={(e) => setNewRole({...newRole, type: e.target.value})}
              className="input w-full"
            >
              <option value="">Seleccionar rol</option>
              {roleOptions.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddRole}
            className="btn btn-secondary"
            disabled={!newRole.type}
          >
            <Plus size={16} />
            Agregar Rol
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className="btn btn-secondary"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="btn btn-primary"
          disabled={profileData.roles.length === 0}
        >
          Siguiente: Recursos
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gradient mb-2">Recursos de Recolección</h3>
        <p className="text-gray-400">Configura tus niveles de recolección</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Object.entries(profileData.gathering).map(([resource, tier]) => (
          <div key={resource}>
            <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
              {resource}
            </label>
            <select
              value={tier}
              onChange={(e) => setProfileData({
                ...profileData,
                gathering: {
                  ...profileData.gathering,
                  [resource]: e.target.value
                }
              })}
              className="input w-full"
            >
              {tierOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className="btn btn-secondary"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(4)}
          className="btn btn-primary"
        >
          Siguiente: Finalizar
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gradient mb-2">Información Adicional</h3>
        <p className="text-gray-400">Opcional: Agrega información de gremio y ciudad</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Gremio
          </label>
          <input
            type="text"
            value={profileData.guild}
            onChange={(e) => setProfileData({...profileData, guild: e.target.value})}
            placeholder="Nombre del gremio"
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Alianza
          </label>
          <input
            type="text"
            value={profileData.alliance}
            onChange={(e) => setProfileData({...profileData, alliance: e.target.value})}
            placeholder="Nombre de la alianza"
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ciudad Principal
          </label>
          <input
            type="text"
            value={profileData.city}
            onChange={(e) => setProfileData({...profileData, city: e.target.value})}
            placeholder="Bridgewatch, Martlock, etc."
            className="input w-full"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className="btn btn-secondary"
        >
          Anterior
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={loading}
          className="btn btn-primary"
        >
          <Save size={16} />
          {loading ? 'Completando...' : 'Completar Perfil'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gradient mb-2">Completar Perfil</h2>
        <p className="text-gray-400">
          Configura tus roles y recursos para participar en actividades
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-400">Paso {currentStep} de 4</span>
          <span className="text-sm text-gray-400">{Math.round((currentStep / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
    </div>
  );
};

export default CompleteProfile; 