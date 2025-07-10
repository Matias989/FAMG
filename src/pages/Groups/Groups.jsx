import React, { useState, useEffect, useRef } from 'react';
import { Users, Plus, Volume2 } from 'lucide-react';
import GroupsList from '../../components/GroupsList';
import CreateGroup from '../../components/CreateGroup';
import GroupCompletionNotification from '../../components/GroupCompletionNotification';
import SoundSettings from '../../components/SoundSettings';
import useGroupCompletion from '../../hooks/useGroupCompletion';
import { groupsService } from '../../services/groupsService';
import { useNotification } from '../../contexts/NotificationContext';
import { useAuth } from '../../contexts/AuthContext';

const Groups = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const [showGroupConflict, setShowGroupConflict] = useState(false);
  const [activeGroup, setActiveGroup] = useState(null);
  const [wantedGroup, setWantedGroup] = useState(null);
  const pollingIntervalId = useRef(null);

  // Hook para detectar grupos completados
  const {
    showNotification: showCompletionNotification,
    notificationGroup,
    dismissNotification,
    closeNotification
  } = useGroupCompletion(groups, user);

  // Cargar grupos al montar el componente y con polling
  useEffect(() => {
    loadGroups();
  }, []);

  // Polling solo si el usuario pertenece a un grupo activo
  useEffect(() => {
    // Buscar si el usuario está en algún slot de algún grupo activo
    const userInActiveGroup = groups.some(group =>
      group.status === 'Activo' &&
      group.slots && group.slots.some(slot => slot.user && slot.user.albionNick === user.albionNick)
    );
    if (userInActiveGroup && !pollingIntervalId.current) {
      pollingIntervalId.current = setInterval(() => {
        loadGroups();
      }, 30000);
    } else if (!userInActiveGroup && pollingIntervalId.current) {
      clearInterval(pollingIntervalId.current);
      pollingIntervalId.current = null;
    }
    return () => {
      if (pollingIntervalId.current) {
        clearInterval(pollingIntervalId.current);
        pollingIntervalId.current = null;
      }
    };
  }, [groups, user]);

  // Función para detener el polling (solo para este usuario)
  const stopPolling = () => {
    if (pollingIntervalId.current) {
      clearInterval(pollingIntervalId.current);
      pollingIntervalId.current = null;
    }
  };

  // Función para reiniciar el polling (por ejemplo, al volver a la lista de grupos)
  const startPolling = () => {
    if (!pollingIntervalId.current) {
      pollingIntervalId.current = setInterval(() => {
        loadGroups();
      }, 30000);
    }
  };

  // Al cerrar o aceptar el modal de grupo completo, detener el polling
  const handleGroupModalClose = () => {
    stopPolling();
    closeNotification();
  };
  const handleGroupModalDismiss = () => {
    stopPolling();
    dismissNotification();
  };

  // Nueva función centralizada para mostrar el modal de conflicto desde hijos
  const handleGroupConflict = async (action, group, wantedGroupParam = null) => {
    setActiveGroup(group);
    setShowGroupConflict(true);
    setWantedGroup(wantedGroupParam);
  };

  const loadGroups = async () => {
    try {
      setLoading(true);
      const groupsData = await groupsService.getGroups();
      // Ordenar: primero el grupo donde el usuario está activo
      const userActiveGroupIndex = groupsData.findIndex(group =>
        group.status === 'Activo' &&
        group.slots && group.slots.some(slot => slot.user && slot.user.albionNick === user.albionNick)
      );
      let orderedGroups = [...groupsData];
      if (userActiveGroupIndex > 0) {
        const [activeGroup] = orderedGroups.splice(userActiveGroupIndex, 1);
        orderedGroups.unshift(activeGroup);
      }
      setGroups(orderedGroups);
    } catch (error) {
      showNotification('Error al cargar grupos', 'error');
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (newGroup) => {
    try {
      const createdGroup = await groupsService.createGroup(newGroup);
      setGroups(prev => [createdGroup, ...prev]);
      showNotification('Grupo creado exitosamente', 'success');
      setShowCreateGroup(false);
    } catch (error) {
      // Manejar error personalizado del backend
      const backendMsg = error?.response?.data?.error || error.message;
      if (backendMsg.includes('Ya perteneces a otro grupo activo')) {
        // Si el backend retorna el grupo existente, úsalo
        const existingGroup = error?.response?.data?.existingGroup;
        if (existingGroup) {
          setActiveGroup(existingGroup);
        } else {
          // Fallback: buscar el grupo activo
          const active = await groupsService.getActiveGroupByUserId(user.albionNick);
          setActiveGroup(active);
        }
        setShowGroupConflict(true);
      } else {
        showNotification(backendMsg || 'Error al crear grupo', 'error');
      }
    }
  };

  const handleLeaveActiveGroup = async () => {
    if (!activeGroup) return;
    await groupsService.removeMemberFromGroup(activeGroup._id, user.albionNick);
    setShowGroupConflict(false);
    setActiveGroup(null);
    // Si hay un grupo destino, intentar unirse automáticamente
    if (wantedGroup) {
      try {
        await groupsService.addMemberToGroup(wantedGroup._id, { albionNick: user.albionNick, username: user.albionNick });
        setWantedGroup(null);
        loadGroups();
      } catch (error) {
        showNotification('Error al unirse al nuevo grupo', 'error');
        setWantedGroup(null);
      }
    } else {
      // Recargar grupos
      loadGroups();
    }
  };

  const handleUpdateGroup = async (updatedGroup) => {
    try {
      const updated = await groupsService.updateGroup(updatedGroup._id, updatedGroup);
      setGroups(prev => prev.map(group => 
        group._id === updated._id ? updated : group
      ));
      showNotification('Grupo actualizado exitosamente', 'success');
    } catch (error) {
      showNotification('Error al actualizar grupo', 'error');
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      try {
        await groupsService.deleteGroup(groupId);
        setGroups(prev => prev.filter(group => group._id !== groupId));
        showNotification('Grupo eliminado exitosamente', 'success');
      } catch (error) {
        showNotification('Error al eliminar grupo', 'error');
      }
    }
  };

  // Usuarios simulados registrados (mismo que en Calculator)
  const registeredUsers = [
    { 
      id: 1, 
      username: 'TankMaster', 
      avatar: '🛡️', 
      role: 'Tanque', 
      level: 100, 
      experience: 'Experto',
      roles: [
        { role: 'Tanque', weapon: 'Espada y Escudo' },
        { role: 'Tanque', weapon: 'Martillo' }
      ],
      gathering: {
        'Mineral': 'T8',
        'Madera': 'T6',
        'Fibra': 'T5'
      }
    },
    { 
      id: 2, 
      username: 'HealPro', 
      avatar: '💚', 
      role: 'Sanador', 
      level: 95, 
      experience: 'Avanzado',
      roles: [
        { role: 'Sanador', weapon: 'Bastón Sagrado' },
        { role: 'Sanador', weapon: 'Bastón de Naturaleza' }
      ],
      gathering: {
        'Fibra': 'T7',
        'Piedra': 'T5'
      }
    },
    { 
      id: 3, 
      username: 'DPSKiller', 
      avatar: '⚔️', 
      role: 'DPS', 
      level: 88, 
      experience: 'Intermedio',
      roles: [
        { role: 'DPS Melee', weapon: 'Espada' },
        { role: 'DPS Melee', weapon: 'Daga' }
      ],
      gathering: {
        'Mineral': 'T6',
        'Madera': 'T4'
      }
    },
    { 
      id: 4, 
      username: 'RangedShot', 
      avatar: '🏹', 
      role: 'DPS Ranged', 
      level: 92, 
      experience: 'Avanzado',
      roles: [
        { role: 'DPS Ranged', weapon: 'Arco' },
        { role: 'DPS Ranged', weapon: 'Ballesta' }
      ],
      gathering: {
        'Madera': 'T7',
        'Piel': 'T5'
      }
    },
    { 
      id: 5, 
      username: 'SupportMage', 
      avatar: '🔮', 
      role: 'Soporte', 
      level: 85, 
      experience: 'Intermedio',
      roles: [
        { role: 'Soporte', weapon: 'Bastón Arcano' },
        { role: 'Soporte', weapon: 'Bastón de Naturaleza' }
      ],
      gathering: {
        'Fibra': 'T6',
        'Piedra': 'T4'
      }
    },
    { 
      id: 6, 
      username: 'Gatherer', 
      avatar: '🌿', 
      role: 'Recolector', 
      level: 100, 
      experience: 'Experto',
      roles: [],
      gathering: {
        'Mineral': 'T8',
        'Madera': 'T8',
        'Fibra': 'T8',
        'Piedra': 'T8',
        'Piel': 'T8',
        'Pescado': 'T7'
      }
    },
    { 
      id: 7, 
      username: 'CraftMaster', 
      avatar: '🔨', 
      role: 'Crafteador', 
      level: 98, 
      experience: 'Experto',
      roles: [],
      gathering: {
        'Mineral': 'T7',
        'Madera': 'T7',
        'Fibra': 'T7',
        'Piedra': 'T7'
      }
    },
    { 
      id: 8, 
      username: 'PvPWarrior', 
      avatar: '⚔️', 
      role: 'PvP', 
      level: 90, 
      experience: 'Avanzado',
      roles: [
        { role: 'DPS Melee', weapon: 'Espada' },
        { role: 'DPS Melee', weapon: 'Daga' },
        { role: 'DPS Ranged', weapon: 'Arco' }
      ],
      gathering: {
        'Mineral': 'T5',
        'Madera': 'T4'
      }
    },
    { 
      id: 9, 
      username: 'DungeonRunner', 
      avatar: '🛡️', 
      role: 'PvE', 
      level: 87, 
      experience: 'Intermedio',
      roles: [
        { role: 'Tanque', weapon: 'Espada y Escudo' },
        { role: 'DPS Melee', weapon: 'Espada' }
      ],
      gathering: {
        'Mineral': 'T6',
        'Madera': 'T5'
      }
    },
    { 
      id: 10, 
      username: 'HCEElite', 
      avatar: '🔥', 
      role: 'HCE', 
      level: 100, 
      experience: 'Experto',
      roles: [
        { role: 'Tanque', weapon: 'Martillo' },
        { role: 'Sanador', weapon: 'Bastón Sagrado' },
        { role: 'DPS Melee', weapon: 'Espada' }
      ],
      gathering: {
        'Mineral': 'T7',
        'Madera': 'T6',
        'Fibra': 'T6'
      }
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 glow">⚔️</div>
          <h2 className="text-2xl font-bold text-gradient">Cargando grupos...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-400" />
              <span>Grupos Abiertos</span>
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              Grupos continuos donde los miembros pueden unirse en cualquier momento. 
              Usa plantillas para organizar actividades.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowSoundSettings(true)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              title="Configuración de Sonido"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setShowCreateGroup(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Grupo</span>
            </button>
          </div>
        </div>

        <GroupsList
          groups={groups}
          onUpdateGroup={handleUpdateGroup}
          onDeleteGroup={handleDeleteGroup}
          registeredUsers={registeredUsers}
          reloadGroups={loadGroups}
          onBackToList={startPolling}
          onGroupConflict={handleGroupConflict} // <-- Pasar función al hijo
        />

        {/* Create Group Modal */}
        {showCreateGroup && (
          <CreateGroup
            onClose={() => setShowCreateGroup(false)}
            onCreateGroup={handleCreateGroup}
            currentUser={user}
          />
        )}

        {/* Modal de conflicto de grupo al crear */}
        {showGroupConflict && activeGroup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-dark-800 rounded-lg p-8 max-w-md w-full text-center">
              <h2 className="text-xl font-bold mb-4 text-red-400">¡Ya perteneces a un grupo!</h2>
              <p className="mb-4">Debes salir de tu grupo actual para poder crear o unirte a otro grupo.</p>
              <div className="mb-4 p-4 bg-dark-700 rounded">
                <div className="font-semibold text-white mb-2">Grupo actual:</div>
                <div className="text-lg text-gold-400">{activeGroup.name}</div>
                <div className="text-gray-400">Miembros: {activeGroup.slots ? activeGroup.slots.filter(s => s.user).length : 0}</div>
              </div>
              <button
                onClick={handleLeaveActiveGroup}
                className="btn btn-danger w-full mb-2"
              >
                Salir de este grupo
              </button>
              <button
                onClick={() => setShowGroupConflict(false)}
                className="btn btn-secondary w-full"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Group Completion Notification */}
        {showCompletionNotification && notificationGroup && (
          <GroupCompletionNotification
            group={notificationGroup}
            isVisible={showCompletionNotification}
            onClose={handleGroupModalClose}
            onDismiss={handleGroupModalDismiss}
          />
        )}

        {/* Sound Settings Modal */}
        {showSoundSettings && (
          <SoundSettings
            isVisible={showSoundSettings}
            onClose={() => setShowSoundSettings(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Groups; 