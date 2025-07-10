import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { authService } from '../../services/authService';
import { User, Edit, Save, X, Plus, Trash2, Shield, Sword, Target, Heart, Star } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
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
  const experienceOptions = ['Principiante', 'Intermedio', 'Avanzado', 'Experto'];

  useEffect(() => {
    if (user) {
      setProfileData({
        roles: user.roles || [],
        gathering: user.gathering || {
          mineral: 'T1',
          madera: 'T1',
          fibra: 'T1',
          piedra: 'T1',
          piel: 'T1',
          pescado: 'T1'
        },
        guild: user.guild || '',
        alliance: user.alliance || '',
        city: user.city || ''
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleGatheringChange = (resource, tier) => {
    setProfileData({
      ...profileData,
      gathering: {
        ...profileData.gathering,
        [resource]: tier
      }
    });
  };

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

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(profileData);
      setEditing(false);
      showNotification('Perfil actualizado exitosamente', 'success');
    } catch (error) {
      showNotification('Error al actualizar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (roleType) => {
    const role = roleOptions.find(r => r.value === roleType);
    return role ? role.icon : User;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚔️</div>
          <h2 className="text-2xl font-bold">Cargando perfil...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Mi Perfil</h1>
          <p className="text-gray-400">Gestiona tu información y roles</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Información Básica */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gradient">Información Personal</h2>
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn btn-secondary"
                >
                  {editing ? <X size={20} /> : <Edit size={20} />}
                  {editing ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nick de Albion
                  </label>
                  <div className="text-lg font-semibold text-blue-400">
                    {user.albionNick}
                  </div>
                </div>
              </div>

              {editing && (
                <div className="mt-6">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-primary"
                  >
                    <Save size={16} />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              )}
            </div>

            {/* Roles */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gradient mb-6">Roles de Combate</h2>
              
              {/* Roles existentes */}
              {profileData.roles.length > 0 && (
                <div className="space-y-3 mb-6">
                  {profileData.roles.map((role, index) => {
                    const IconComponent = getRoleIcon(role.type);
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <IconComponent size={20} className="text-blue-400" />
                          <span className={`px-2 py-1 rounded text-xs ${
                            role.isPrimary ? 'bg-gold-500/20 text-gold-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {role.isPrimary ? 'Principal' : 'Secundario'}
                          </span>
                          <span className="font-medium">{role.type}</span>
                        </div>
                        {editing && (
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
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Agregar nuevo rol */}
              {editing && (
                <div className="p-4 border border-gray-600 rounded-lg">
                  <h4 className="font-semibold text-gray-300 mb-4">Agregar nuevo rol:</h4>
                  <div className="flex gap-4">
                    <select
                      value={newRole.type}
                      onChange={(e) => setNewRole({...newRole, type: e.target.value})}
                      className="input flex-1"
                    >
                      <option value="">Seleccionar rol</option>
                      {roleOptions.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddRole}
                      className="btn btn-secondary"
                      disabled={!newRole.type}
                    >
                      <Plus size={16} />
                      Agregar
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Recursos de Recolección */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gradient mb-6">Recursos de Recolección</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(profileData.gathering).map(([resource, tier]) => (
                  <div key={resource}>
                    <label className="block text-sm font-medium text-gray-300 mb-2 capitalize">
                      {resource}
                    </label>
                    {editing ? (
                      <select
                        value={tier}
                        onChange={(e) => handleGatheringChange(resource, e.target.value)}
                        className="input w-full"
                      >
                        {tierOptions.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-lg font-semibold text-green-400">
                        {tier}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Información Adicional */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gradient mb-6">Información Adicional</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gremio
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileData.guild}
                      onChange={(e) => handleChange('guild', e.target.value)}
                      placeholder="Nombre del gremio"
                      className="input w-full"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-purple-400">
                      {profileData.guild && profileData.guild.trim() !== '' ? profileData.guild : 'No especificado'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Alianza
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileData.alliance}
                      onChange={(e) => handleChange('alliance', e.target.value)}
                      placeholder="Nombre de la alianza"
                      className="input w-full"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-orange-400">
                      {profileData.alliance && profileData.alliance.trim() !== '' ? profileData.alliance : 'No especificado'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ciudad Principal
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Bridgewatch, Martlock, etc."
                      className="input w-full"
                    />
                  ) : (
                    <div className="text-lg font-semibold text-cyan-400">
                      {profileData.city && profileData.city.trim() !== '' ? profileData.city : 'No especificado'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Estadísticas */}
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-bold text-gradient mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Actividades</span>
                  <span className="font-semibold text-blue-400">{user.stats?.activitiesJoined || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Eventos</span>
                  <span className="font-semibold text-green-400">{user.stats?.eventsConfirmed || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Loot Compartido</span>
                  <span className="font-semibold text-yellow-400">{user.stats?.totalLootShared || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Reputación</span>
                  <span className="font-semibold text-purple-400">{user.stats?.reputation || 0}</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-gradient mb-4">Información de Cuenta</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Miembro desde</span>
                  <span className="font-semibold text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Último login</span>
                  <span className="font-semibold text-gray-300">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Perfil completo</span>
                  <span className={`font-semibold ${user.profileCompleted ? 'text-green-400' : 'text-red-400'}`}>
                    {user.profileCompleted ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 