import { useState, useEffect, useCallback } from 'react';
import { createTrumpetSound } from '../utils/audioUtils';
import { groupsService } from '../services/groupsService';

const useGroupCompletion = (groups, currentUser) => {
  const [completedGroups, setCompletedGroups] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationGroup, setNotificationGroup] = useState(null);

  // Nuevo: función para forzar apertura manual
  const forceShowNotification = (group) => {
    setNotificationGroup(group);
    setShowNotification(true);
    const trumpetSound = createTrumpetSound();
    trumpetSound.play();
  };

  useEffect(() => {
    // Detectar grupos completos donde el usuario pertenece
    const completed = groups.filter(group => {
      const isFull = (group.slots?.filter(s => s.user).length || 0) >= (group.slots?.length || 0);
      const isMember = group.slots?.some(s => s.user && (s.user.id === currentUser?.id || s.user.albionNick === currentUser?.albionNick));
      return isFull && isMember;
    });

    if (completed.length > 0) {
      // Mostrar notificación para el primer grupo completo
      const firstCompleted = completed[0];
      setNotificationGroup(firstCompleted);
      setShowNotification(true);
      const trumpetSound = createTrumpetSound();
      trumpetSound.play();
    } else {
      // Si ya no hay grupo completo, cerrar el modal
      setShowNotification(false);
      setNotificationGroup(null);
    }
    // Nunca cerramos automáticamente el modal aquí
  }, [groups, currentUser]);

  useEffect(() => {
    if (showNotification && notificationGroup) {
      const stillExists = groups.some(g => g._id === notificationGroup._id);
      if (!stillExists) {
        setShowNotification(false);
        setNotificationGroup(null);
      }
    }
  }, [groups, showNotification, notificationGroup]);

  const dismissNotification = () => {
    setShowNotification(false);
    setNotificationGroup(null);
  };

  const closeNotification = () => {
    setShowNotification(false);
    setNotificationGroup(null);
    // Aquí podrías navegar al grupo o abrir el gestor
  };

  return {
    showNotification,
    notificationGroup,
    dismissNotification,
    closeNotification,
    completedGroups,
    forceShowNotification // Nuevo: para forzar apertura tras unirse
  };
};

// Hook personalizado para polling eficiente de grupos
export const useGroupsPolling = (user, pollingInterval = 30000) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Comparación profunda solo de campos relevantes y ordenando
  const areGroupsEqual = useCallback((a, b) => {
    if (a.length !== b.length) return false;
    // Ordenar por _id para evitar problemas de orden
    const sortById = arr => [...arr].sort((g1, g2) => g1._id.localeCompare(g2._id));
    const aSorted = sortById(a);
    const bSorted = sortById(b);

    for (let i = 0; i < aSorted.length; i++) {
      const g1 = aSorted[i];
      const g2 = bSorted[i];
      if (!g2 || g1._id !== g2._id || g1.status !== g2.status) return false;

      // Comparar slots
      const slots1 = g1.slots || [];
      const slots2 = g2.slots || [];
      if (slots1.length !== slots2.length) return false;
      for (let j = 0; j < slots1.length; j++) {
        const s1 = slots1[j];
        const s2 = slots2[j];
        if (s1.role !== s2.role) return false;
        if ((s1.user?.albionNick || null) !== (s2.user?.albionNick || null)) return false;
      }
    }
    return true;
  }, []);

  // Función optimizada para cargar grupos
  const loadGroupsOptimized = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔄 Cargando grupos...');
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
      // Solo actualizar si hay cambios reales
      if (!areGroupsEqual(orderedGroups, groups)) {
        console.log('✅ Grupos actualizados:', orderedGroups.length, 'grupos');
        setGroups(orderedGroups);
        setLastUpdate(new Date());
      } else {
        console.log('⏭️ No hay cambios en los grupos');
      }
    } catch (error) {
      console.error('❌ Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  }, [groups, user, areGroupsEqual]);

  // Polling optimizado
  useEffect(() => {
    // Cargar grupos inicialmente
    loadGroupsOptimized();
  }, [user, pollingInterval]);

  // Polling separado que se ejecuta después de cargar los grupos
  useEffect(() => {
    // Verificar si el usuario está en un grupo activo
    const userInActiveGroup = groups.some(group =>
      group.status === 'Activo' &&
      group.slots && group.slots.some(slot => slot.user && slot.user.albionNick === user.albionNick)
    );
    
    console.log('👤 Usuario en grupo activo:', userInActiveGroup, 'Usuario:', user?.albionNick);
    
    if (userInActiveGroup) {
      console.log('🔄 Iniciando polling cada', pollingInterval, 'ms');
      const intervalId = setInterval(() => {
        console.log('⏰ Ejecutando polling...');
        loadGroupsOptimized();
      }, pollingInterval);
      return () => {
        console.log('🛑 Deteniendo polling');
        clearInterval(intervalId);
      };
    } else {
      console.log('⏸️ No hay polling activo - usuario no está en grupo activo');
    }
  }, [groups, user, pollingInterval, loadGroupsOptimized]);

  return {
    groups,
    loading,
    lastUpdate,
    loadGroups: loadGroupsOptimized
  };
};

export default useGroupCompletion; 