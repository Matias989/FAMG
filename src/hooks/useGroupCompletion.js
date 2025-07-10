import { useState, useEffect } from 'react';
import { createTrumpetSound } from '../utils/audioUtils';

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

    if (completed.length > 0 && !showNotification) {
      // Mostrar notificación para el primer grupo completo solo si no está ya visible
      const firstCompleted = completed[0];
      setNotificationGroup(firstCompleted);
      setShowNotification(true);
      const trumpetSound = createTrumpetSound();
      trumpetSound.play();
    }
    // Nunca cerramos automáticamente el modal aquí
  }, [groups, currentUser]);

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

export default useGroupCompletion; 