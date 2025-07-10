import { activityService } from './activityService';

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
  }
}; 