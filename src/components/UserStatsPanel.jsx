import React from 'react';
import { X, User, Shield, Heart, Zap, Target, Star, Edit, Sword, Leaf } from 'lucide-react';

const UserStatsPanel = ({ user, onClose, onEditProfile }) => {
  if (!user) return null;

  const getExperienceColor = (experience) => {
    switch (experience) {
      case 'Experto': return 'text-yellow-400';
      case 'Avanzado': return 'text-green-400';
      case 'Intermedio': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Tanque': return <Shield className="w-4 h-4" />;
      case 'Sanador': return <Heart className="w-4 h-4" />;
      case 'DPS': return <Zap className="w-4 h-4" />;
      case 'DPS Ranged': return <Target className="w-4 h-4" />;
      case 'Soporte': return <Star className="w-4 h-4" />;
      case 'Recolector': return <User className="w-4 h-4" />;
      case 'Crafteador': return <User className="w-4 h-4" />;
      case 'PvP': return <Zap className="w-4 h-4" />;
      case 'PvE': return <Shield className="w-4 h-4" />;
      case 'HCE': return <Star className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{user.avatar}</div>
            <div>
              <h2 className="text-xl font-bold text-white">{user.username}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-blue-400">
                  Lv.{user.level}
                </span>
                <span className="text-gray-400">•</span>
                <span className={`font-medium ${getExperienceColor(user.experience)}`}>
                  {user.experience}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEditProfile(user)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Rol Principal */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              {getRoleIcon(user.role)}
              <h3 className="text-lg font-semibold text-white">Rol Principal</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-medium">{user.role}</span>
            </div>
          </div>

          {/* Roles de Combate */}
          {user.roles && user.roles.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Sword className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-white">Roles de Combate</h3>
              </div>
              <div className="space-y-2">
                {user.roles.map((role, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span className="text-blue-400 font-medium">{role.role}</span>
                    <span className="text-gray-300">{role.weapon}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Niveles de Recolección */}
          {user.gathering && Object.keys(user.gathering).length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Leaf className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-white">Recolección</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(user.gathering).map(([type, tier]) => (
                  <div key={type} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                    <span className="text-green-400 font-medium">{type}</span>
                    <span className="text-yellow-400 font-medium">{tier}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estadísticas Básicas */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Nivel</p>
                <p className="text-white font-medium">{user.level}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Experiencia</p>
                <p className={`font-medium ${getExperienceColor(user.experience)}`}>
                  {user.experience}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatsPanel; 