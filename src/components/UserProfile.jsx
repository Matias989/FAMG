import React, { useState } from 'react';
import { X, Plus, Trash2, Edit, Save, User, Sword, Leaf } from 'lucide-react';
import userRolesData from '../data/user-roles.json';

const UserProfile = ({ user, onClose, onSave }) => {
  const [editingUser, setEditingUser] = useState({
    ...user,
    roles: user.roles || [],
    gathering: user.gathering || {}
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showAddGathering, setShowAddGathering] = useState(false);
  const [newRole, setNewRole] = useState({ role: '', weapon: '' });
  const [newGathering, setNewGathering] = useState({ type: '', tier: 'T1' });

  const handleSave = () => {
    onSave(editingUser);
    setIsEditing(false);
  };

  const addRole = () => {
    if (newRole.role && newRole.weapon) {
      setEditingUser({
        ...editingUser,
        roles: [...editingUser.roles, newRole]
      });
      setNewRole({ role: '', weapon: '' });
      setShowAddRole(false);
    }
  };

  const removeRole = (index) => {
    const updatedRoles = editingUser.roles.filter((_, i) => i !== index);
    setEditingUser({
      ...editingUser,
      roles: updatedRoles
    });
  };

  const addGathering = () => {
    if (newGathering.type && newGathering.tier) {
      setEditingUser({
        ...editingUser,
        gathering: {
          ...editingUser.gathering,
          [newGathering.type]: newGathering.tier
        }
      });
      setNewGathering({ type: '', tier: 'T1' });
      setShowAddGathering(false);
    }
  };

  const removeGathering = (type) => {
    const updatedGathering = { ...editingUser.gathering };
    delete updatedGathering[type];
    setEditingUser({
      ...editingUser,
      gathering: updatedGathering
    });
  };

  const getWeaponsForRole = (roleName) => {
    const role = userRolesData.combat_roles.find(r => r.name === roleName);
    return role ? role.weapons : [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{editingUser.avatar}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{editingUser.username}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold text-blue-400">
                  Lv.{editingUser.level}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-green-400 font-medium">
                  {editingUser.experience}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Guardar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Roles de Combate */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Sword className="w-5 h-5" />
                <span>Roles de Combate</span>
              </h3>
              {isEditing && (
                <button
                  onClick={() => setShowAddRole(true)}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Rol</span>
                </button>
              )}
            </div>

            {editingUser.roles.length === 0 ? (
              <p className="text-gray-400 italic">No hay roles configurados</p>
            ) : (
              <div className="space-y-3">
                {editingUser.roles.map((role, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-blue-400 font-medium">{role.role}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-white">{role.weapon}</span>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeRole(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Modal para agregar rol */}
            {showAddRole && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Agregar Rol</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Rol
                      </label>
                      <select
                        value={newRole.role}
                        onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar rol</option>
                        {userRolesData.combat_roles.map((role) => (
                          <option key={role.name} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {newRole.role && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Arma
                        </label>
                        <select
                          value={newRole.weapon}
                          onChange={(e) => setNewRole({ ...newRole, weapon: e.target.value })}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Seleccionar arma</option>
                          {getWeaponsForRole(newRole.role).map((weapon) => (
                            <option key={weapon} value={weapon}>
                              {weapon}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={addRole}
                      disabled={!newRole.role || !newRole.weapon}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Agregar
                    </button>
                    <button
                      onClick={() => setShowAddRole(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Niveles de Recolección */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Leaf className="w-5 h-5" />
                <span>Niveles de Recolección</span>
              </h3>
              {isEditing && (
                <button
                  onClick={() => setShowAddGathering(true)}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Agregar Recolección</span>
                </button>
              )}
            </div>

            {Object.keys(editingUser.gathering).length === 0 ? (
              <p className="text-gray-400 italic">No hay niveles de recolección configurados</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(editingUser.gathering).map(([type, tier]) => (
                  <div key={type} className="flex items-center justify-between p-3 bg-gray-700 rounded">
                    <div className="flex items-center space-x-3">
                      <span className="text-green-400 font-medium">{type}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-yellow-400 font-medium">{tier}</span>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => removeGathering(type)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Modal para agregar recolección */}
            {showAddGathering && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                  <h4 className="text-lg font-semibold text-white mb-4">Agregar Recolección</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Tipo de Recolección
                      </label>
                      <select
                        value={newGathering.type}
                        onChange={(e) => setNewGathering({ ...newGathering, type: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Seleccionar tipo</option>
                        {userRolesData.gathering_types.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nivel (Tier)
                      </label>
                      <select
                        value={newGathering.tier}
                        onChange={(e) => setNewGathering({ ...newGathering, tier: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {userRolesData.tiers.map((tier) => (
                          <option key={tier} value={tier}>
                            {tier}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={addGathering}
                      disabled={!newGathering.type}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Agregar
                    </button>
                    <button
                      onClick={() => setShowAddGathering(false)}
                      className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 