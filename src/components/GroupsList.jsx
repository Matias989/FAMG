import React, { useState, useEffect, useRef } from 'react';
import { Users, Calendar, MapPin, Clock, Crown, Settings, UserPlus, Eye } from 'lucide-react';
import GroupManager from './GroupManager';
import { useAuth } from '../contexts/AuthContext';
import { groupsService } from '../services/groupsService';
import { useGroupsStore } from '../store/useGroupsStore';

// Eliminar React.memo y arePropsEqual
// Componente para mostrar la lista de grupos
const GroupsList = ({ onUpdateGroup, onDeleteGroup, registeredUsers, reloadGroups, onBackToList, onGroupConflict }) => {
  const { user } = useAuth();
  const groups = useGroupsStore(state => state.groups);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [groupAction, setGroupAction] = useState(null); // 'join' o 'create'
  const modalOpenedManually = useRef(false); // Ref para rastrear si el modal fue abierto manualmente
  // Ref para saber si el usuario estaba en el grupo al abrir el modal
  const userWasInGroup = useRef(false);

  // Siempre busca el grupo actualizado por ID
  const selectedGroup = useGroupsStore(state => state.getGroupById(selectedGroupId));

  const handleManageGroup = (group) => {
    setSelectedGroupId(group._id);
    setShowGroupManager(true);
    modalOpenedManually.current = true; // Marcar como abierto manualmente
    // Guardar si el usuario estaba en el grupo al abrir el modal
    userWasInGroup.current = group.slots && group.slots.some(slot => slot.user && slot.user.albionNick === user?.albionNick);
  };

  const handleUpdateGroup = (updatedGroup) => {
    onUpdateGroup(updatedGroup);
    // Ya no cerramos el modal aquí, solo actualizamos el grupo seleccionado si sigue existiendo
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'Dungeon': return '🏰';
      case 'GvG': return '⚔️';
      case 'HCE': return '🔥';
      case 'ZvZ': return '🏛️';
      case 'Gathering': return '🌿';
      case 'Crafting': return '🔨';
      case 'PvP': return '⚡';
      default: return '🎯';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Activo': return 'text-green-400';
      case 'En Preparación': return 'text-yellow-400';
      case 'Completado': return 'text-blue-400';
      case 'Cancelado': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Nueva función para intentar unirse a un grupo o cambiar de slot
  const handleTryJoinGroup = async (group) => {
    // Verificar si el usuario ya está en este grupo
    const userInGroup = group.slots && group.slots.some(slot => slot.user && slot.user.albionNick === user.albionNick);
    if (userInGroup) {
      // Cambiar de slot: simplemente llamar a addMemberToGroup (el backend ya libera el slot anterior)
      try {
        await groupsService.addMemberToGroup(group._id, { albionNick: user.albionNick, username: user.albionNick });
        if (reloadGroups) reloadGroups();
      } catch (error) {
        // Manejar error si ocurre
      }
      return;
    }
    // Si no está en este grupo, verificar si está en otro grupo activo
    try {
      await groupsService.addMemberToGroup(group._id, { albionNick: user.albionNick, username: user.albionNick });
      if (reloadGroups) reloadGroups();
    } catch (error) {
      // Si el error es de que ya pertenece a otro grupo, mostrar modal
      const backendMsg = error?.response?.data?.error || error.message;
      if (backendMsg.toLowerCase().includes('ya perteneces a otro grupo')) {
        const existingGroup = error?.response?.data?.existingGroup;
        if (onGroupConflict && existingGroup) onGroupConflict('join', existingGroup, group);
      }
    }
  };

  // Nueva función para intentar crear un grupo
  const handleTryCreateGroup = async (newGroup) => {
    try {
      // await groupsService.createGroup(newGroup);
    } catch (error) {
      if (error.message.includes('ya pertenece a otro grupo')) {
        const active = await groupsService.getActiveGroupByUserId(user.id);
        if (onGroupConflict) onGroupConflict('create', active);
      }
    }
  };

  // Mantener actualizado el grupo seleccionado tras polling
  useEffect(() => {
    if (showGroupManager && selectedGroupId) {
      const updated = groups.find(g => g._id === selectedGroupId);
      if (!updated) {
        // Si el grupo fue eliminado, cerrar el modal inmediatamente
        setShowGroupManager(false);
        setSelectedGroupId(null);
        modalOpenedManually.current = false;
        return;
      }
      const userInGroup = updated.slots && updated.slots.some(
        slot => slot.user && slot.user.albionNick === user?.albionNick
      );
      // Solo cerrar el modal si el usuario estaba en el grupo y salió
      if (userWasInGroup.current && !userInGroup) {
        setShowGroupManager(false);
        setSelectedGroupId(null);
        modalOpenedManually.current = false;
      }
    }
  }, [groups, showGroupManager, selectedGroupId, user?.albionNick]);

  // Ordenar grupos: primero el grupo donde el usuario está activo
  const userActiveGroupIndex = groups.findIndex(
    group =>
      group.status === 'Activo' &&
      group.slots &&
      group.slots.some(slot => slot.user && slot.user.albionNick === user.albionNick)
  );
  let orderedGroups = [...groups];
  if (userActiveGroupIndex > 0) {
    const [activeGroup] = orderedGroups.splice(userActiveGroupIndex, 1);
    orderedGroups.unshift(activeGroup);
  }

  // Verificar que groups sea un array
  if (!Array.isArray(orderedGroups) || orderedGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold mb-2">No hay grupos creados</h3>
        <p className="text-gray-400">Crea tu primer grupo para comenzar a organizar actividades</p>
      </div>
    );
  }

  return (
    <>
      {/* Indicador sutil de actualización */}
      <div className="mb-4 text-right">
        <span className="text-xs text-gray-500">
          {orderedGroups.length} grupo{orderedGroups.length !== 1 ? 's' : ''} disponible{orderedGroups.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="space-y-6">
        {Array.isArray(orderedGroups) && orderedGroups.map((group) => {
          const isUserActiveGroup = group.status === 'Activo' && group.slots && group.slots.some(slot => slot.user && slot.user.albionNick === user.albionNick);
          return (
            <div
              key={group._id}
              className={
                isUserActiveGroup
                  ? "bg-gradient-to-br from-yellow-400/30 to-yellow-700/20 border-yellow-400/60 text-gold-400 rounded-lg p-6 border-2 shadow-lg fade-in"
                  : "bg-gray-800 rounded-lg p-6 border border-gray-700"
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-2xl">{getActivityIcon(group.type)}</div>
                    <div>
                      <h3 className={`text-xl font-bold ${isUserActiveGroup ? 'text-gold-400' : 'text-white'}`}>{group.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(group.status)}`}>
                          {group.status}
                        </span>
                        {group.date && !isNaN(new Date(group.date)) && (
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(group.date)}
                          </span>
                        )}
                        {group.location && (
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            {group.location}
                          </span>
                        )}
                        {group.duration && (
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            {group.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {group.description && (
                    <p className="text-gray-300 mb-4">{group.description}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">
                          {group.slots ? group.slots.filter(s => s.user).length : 0}/{group.slots ? group.slots.length : 0} miembros
                        </span>
                      </div>
                      {group.slots && group.slots.some(slot => slot.user && slot.user.id === group.creatorId) && (
                        <div className="flex items-center space-x-1">
                          <Crown className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-yellow-400">Creador asignado</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleManageGroup(group)}
                        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{group.creatorNick === user.albionNick ? 'Gestionar' : 'Ver/Unirse'}</span>
                      </button>
                      {/* Botón Eliminar solo para el creador */}
                      {group.creatorNick === user.albionNick && (
                        <button
                          onClick={() => onDeleteGroup(group._id)}
                          className="flex items-center space-x-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Eliminar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lista de miembros */}
                  {group.slots && group.slots.filter(s => s.user).length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Miembros:</h4>
                      <div className="flex flex-wrap gap-2">
                        {group.slots.filter(s => s.user).map((slot, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
                            <span className="text-lg">{slot.user.avatar || '👤'}</span>
                            <div>
                              <div className="text-sm font-medium text-white">{slot.user.username || slot.user.albionNick}</div>
                              <div className="text-xs text-gray-400">{slot.role}</div>
                            </div>
                            {/* Leyenda de creador: solo mostrar si el grupo es nuevo (sin _id) */}
                            {(!group._id && slot.user && group.creatorNick && slot.user.albionNick === group.creatorNick) && (
                              <span className="ml-2 text-xs text-gold-400">(Creador)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Group Manager Modal */}
        {showGroupManager && selectedGroup && (
          <GroupManager
            group={selectedGroup}
            onUpdateGroup={handleUpdateGroup}
            onClose={() => {
              setShowGroupManager(false);
              setSelectedGroupId(null);
              modalOpenedManually.current = false; // Resetear el flag
              if (onBackToList) onBackToList();
            }}
            registeredUsers={registeredUsers}
            currentUser={user}
            onGroupConflict={onGroupConflict}
            reloadGroups={reloadGroups}
          />
        )}
      </div>
    </>
  );
};

export default GroupsList; 