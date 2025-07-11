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
        console.log('FETCH inicial grupos:', data);
        setGroups(data);
      });

    const socket = io(SOCKET_URL);

    socket.on('groups_init', (groups) => {
      console.log('SOCKET groups_init:', groups);
      setGroups(groups);
    });
    socket.on('group_updated', (data) => {
      const group = data.group || data; // Soporta ambos formatos
      console.log('SOCKET group_updated:', group);
      updateGroup(group);
    });
    socket.on('group_created', (data) => {
      const group = data.group || data;
      console.log('SOCKET group_created:', group);
      updateGroup(group);
    });
    socket.on('group_deleted', (data) => {
      const groupId = data.groupId || data;
      console.log('SOCKET group_deleted:', groupId);
      removeGroup(groupId);
    });

    return () => socket.disconnect();
  }, [setGroups, updateGroup, removeGroup]);
}; 