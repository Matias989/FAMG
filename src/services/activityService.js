import api from '../utils/api';

export const activityService = {
  // Métodos comunes para todas las actividades
  async getAllActivities() {
    try {
      const response = await api.get('/activities');
      return response.data;
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      throw error;
    }
  },

  async getActivityById(id) {
    try {
      const response = await api.get(`/activities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener actividad:', error);
      throw error;
    }
  },

  async createActivity(activityData, type) {
    try {
      const endpoint = type === 'group' ? '/groups' : '/events';
      const response = await api.post(endpoint, activityData);
      return response.data;
    } catch (error) {
      console.error(`Error al crear ${type}:`, error);
      throw error;
    }
  },

  async updateActivity(id, activityData, type) {
    try {
      const endpoint = type === 'group' ? '/groups' : '/events';
      const response = await api.put(`${endpoint}/${id}`, activityData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar ${type}:`, error);
      throw error;
    }
  },

  async deleteActivity(id, type) {
    try {
      const endpoint = type === 'group' ? '/groups' : '/events';
      const response = await api.delete(`${endpoint}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar ${type}:`, error);
      throw error;
    }
  },

  // Métodos específicos para grupos
  async getGroups() {
    try {
      const response = await api.get('/groups');
      return response.data;
    } catch (error) {
      console.error('Error al obtener grupos:', error);
      throw error;
    }
  },

  async createGroup(groupData) {
    try {
      const response = await api.post('/groups', groupData);
      return response.data;
    } catch (error) {
      console.error('Error al crear grupo:', error);
      throw error;
    }
  },

  async updateGroup(groupId, groupData) {
    try {
      const response = await api.put(`/groups/${groupId}`, groupData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar grupo:', error);
      throw error;
    }
  },

  async deleteGroup(groupId) {
    try {
      const response = await api.delete(`/groups/${groupId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar grupo:', error);
      throw error;
    }
  },

  async addMemberToGroup(groupId, memberData) {
    try {
      const response = await api.post(`/groups/${groupId}/members`, memberData);
      return response.data;
    } catch (error) {
      console.error('Error al agregar miembro al grupo:', error);
      throw error;
    }
  },

  async removeMemberFromGroup(groupId, userId) {
    try {
      const response = await api.delete(`/groups/${groupId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error al remover miembro del grupo:', error);
      throw error;
    }
  },

  // Métodos específicos para eventos
  async getEvents() {
    try {
      const response = await api.get('/events');
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos:', error);
      throw error;
    }
  },

  async getUpcomingEvents() {
    try {
      const response = await api.get('/events/upcoming');
      return response.data;
    } catch (error) {
      console.error('Error al obtener eventos próximos:', error);
      throw error;
    }
  },

  async createEvent(eventData) {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error al crear evento:', error);
      throw error;
    }
  },

  async updateEvent(eventId, eventData) {
    try {
      const response = await api.put(`/events/${eventId}`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar evento:', error);
      throw error;
    }
  },

  async deleteEvent(eventId) {
    try {
      const response = await api.delete(`/events/${eventId}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  },

  async confirmAttendance(eventId, userData) {
    try {
      const response = await api.post(`/events/${eventId}/confirm`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al confirmar asistencia:', error);
      throw error;
    }
  },

  async cancelAttendance(eventId, userId) {
    try {
      const response = await api.post(`/events/${eventId}/cancel`, { userId });
      return response.data;
    } catch (error) {
      console.error('Error al cancelar asistencia:', error);
      throw error;
    }
  },

  // Métodos para plantillas
  async applyTemplate(activityId, template, type) {
    try {
      const endpoint = type === 'group' ? '/groups' : '/events';
      const response = await api.put(`${endpoint}/${activityId}`, { template });
      return response.data;
    } catch (error) {
      console.error('Error al aplicar plantilla:', error);
      throw error;
    }
  }
}; 