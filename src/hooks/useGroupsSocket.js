import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useGroupsStore } from '../store/useGroupsStore';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const API_URL = import.meta.env.VITE_API_URL;

export const useGroupsSocket = () => {
  const setGroups = useGroupsStore(state => state.setGroups);
  const updateGroup = useGroupsStore(state => state.updateGroup);
  const removeGroup = useGroupsStore(state => state.removeGroup);

  useEffect(() => {
    // Fetch inicial por HTTP
    fetch(`${API_URL}/groups`)
      .then(res => res.json())
      .then(data => {
        console.log('[Zustand] setGroups desde FETCH:', data);
        setGroups(data);
      });

    // Conexión socket con configuración recomendada para Render
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    socket.on('connect', () => {
      console.log('[Socket] Conectado con ID:', socket.id);
    });
    socket.on('disconnect', (reason) => {
      console.log('[Socket] Desconectado. Razón:', reason);
    });

    socket.on('groups_init', (groups) => {
      // Soporta ambos formatos: array directo o { groups: [...] }
      const groupList = Array.isArray(groups) ? groups : groups.groups;
      console.log('[Zustand] setGroups desde SOCKET groups_init:', groupList);
      setGroups(groupList);
    });
    socket.on('group_updated', (data) => {
      const group = data.group || data; // Soporta ambos formatos
      updateGroup(group);
    });
    socket.on('group_created', (data) => {
      const group = data.group || data;
      updateGroup(group);
    });
    socket.on('group_deleted', (data) => {
      const groupId = data.groupId || data;
      removeGroup(groupId);
    });

    return () => socket.disconnect();
  }, [setGroups, updateGroup, removeGroup]);
}; 