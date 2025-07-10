import { activityService } from './activityService';

export const eventsService = {
  // Obtener todos los eventos
  async getEvents() {
    return await activityService.getEvents();
  },

  // Obtener eventos próximos
  async getUpcomingEvents() {
    return await activityService.getUpcomingEvents();
  },

  // Crear un evento
  async createEvent(eventData) {
    return await activityService.createEvent(eventData);
  },

  // Actualizar un evento
  async updateEvent(eventId, eventData) {
    return await activityService.updateEvent(eventId, eventData);
  },

  // Eliminar un evento
  async deleteEvent(eventId) {
    return await activityService.deleteEvent(eventId);
  },

  // Confirmar asistencia a un evento
  async confirmAttendance(eventId, userData) {
    return await activityService.confirmAttendance(eventId, userData);
  },

  // Cancelar asistencia a un evento
  async cancelAttendance(eventId, userId) {
    return await activityService.cancelAttendance(eventId, userId);
  }
}; 