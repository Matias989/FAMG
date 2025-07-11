import { activityService } from './activityService';
import api from '../utils/api';

export const groupsService = {
  // Obtener todos los grupos
  async getGroups() {
    return await activityService.getGroups();
  },

  // Crear un grupo
  async createGroup(groupData) {
    return await activityService.createGroup(groupData);
  },

  // Actualizar un grupo
  async updateGroup(groupId, groupData) {
    return await activityService.updateGroup(groupId, groupData);
  },

  // Eliminar un grupo
  async deleteGroup(groupId) {
    return await activityService.deleteGroup(groupId);
  },

  // Agregar miembro al grupo
  async addMemberToGroup(groupId, memberData) {
    return await activityService.addMemberToGroup(groupId, memberData);
  },

  // Remover miembro del grupo
  async removeMemberFromGroup(groupId, userId) {
    return await activityService.removeMemberFromGroup(groupId, userId);
  },

  // Buscar grupo activo de un usuario
  async getActiveGroupByUserId(userId) {
    // Suponiendo que hay un endpoint backend GET /groups/active/:userId
    const response = await fetch(`/api/groups/active/${userId}`);
    if (!response.ok) throw new Error('No se pudo obtener el grupo activo');
    return await response.json();
  },

  // --- Plantillas ---
  async getTemplates() {
    const response = await api.get('/templates');
    return response.data;
  },
  async createTemplate(templateData) {
    const response = await api.post('/templates', templateData);
    return response.data;
  },
  async updateTemplate(templateId, templateData) {
    const response = await api.put(`/templates/${templateId}`, templateData);
    return response.data;
  },
  async deleteTemplate(templateId) {
    const response = await api.delete(`/templates/${templateId}`);
    return response.data;
  }
}; 