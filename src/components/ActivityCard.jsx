import React from 'react';
import { Users, MapPin, Clock, Calendar, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';

const ActivityCard = ({ 
  activity, 
  type, // 'group' o 'event'
  onEdit, 
  onDelete, 
  onConfirmAttendance, 
  onCancelAttendance,
  showActions = true 
}) => {
  const isEvent = type === 'event';
  const isGroup = type === 'group';

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case 'Dungeon': return '🏰'
      case 'GvG': return '⚔️'
      case 'HCE': return '🔥'
      case 'ZvZ': return '🏛️'
      case 'Gathering': return '🌿'
      case 'Crafting': return '🔨'
      case 'PvP': return '⚡'
      default: return '🎯'
    }
  }

  const getStatusColor = (status) => {
    if (isEvent) {
      switch (status) {
        case 'Programado': return 'bg-blue-500/20 text-blue-400'
        case 'En Preparación': return 'bg-yellow-500/20 text-yellow-400'
        case 'Activo': return 'bg-green-500/20 text-green-400'
        case 'Completado': return 'bg-purple-500/20 text-purple-400'
        case 'Cancelado': return 'bg-red-500/20 text-red-400'
        default: return 'bg-dark-500/20 text-dark-300'
      }
    } else {
      switch (status) {
        case 'Activo': return 'bg-green-500/20 text-green-400'
        case 'Completado': return 'bg-purple-500/20 text-purple-400'
        case 'Cancelado': return 'bg-red-500/20 text-red-400'
        default: return 'bg-dark-500/20 text-dark-300'
      }
    }
  }

  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const isEventUpcoming = (eventDate) => {
    if (!eventDate) return false;
    return new Date(eventDate) > new Date();
  }

  const isUserConfirmed = (userId) => {
    if (!isEvent || !activity.confirmedMembers) return false;
    return activity.confirmedMembers.some(m => m.userId === userId);
  }

  const handleConfirmAttendance = () => {
    if (onConfirmAttendance) {
      onConfirmAttendance(activity._id, {
        userId: '1', // En una app real, esto vendría del usuario logueado
        username: 'Usuario Demo',
        avatar: '👤',
        role: 'DPS',
        level: 85,
        experience: 'Intermedio'
      });
    }
  };

  const handleCancelAttendance = () => {
    if (onCancelAttendance) {
      onCancelAttendance(activity._id, '1');
    }
  };

  return (
    <div className="card group hover:scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{getActivityIcon(activity.type)}</div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(isEvent ? activity.eventStatus : activity.status)}`}>
            {isEvent ? activity.eventStatus : activity.status}
          </span>
          {isEvent && isEventUpcoming(activity.date) && (
            <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
              Próximo
            </span>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
      <p className="text-dark-300 mb-4">{activity.description}</p>

      <div className="space-y-3">
        {isEvent && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} className="text-gold-400" />
            <span>{formatEventDate(activity.date)}</span>
          </div>
        )}
        
        {activity.duration && (
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-gold-400" />
            <span>{activity.duration}</span>
          </div>
        )}
        
        {activity.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={16} className="text-gold-400" />
            <span>{activity.location}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm">
          <Users size={16} className="text-gold-400" />
          <span>
            {isEvent 
              ? `${activity.confirmedMembers?.length || 0}/${activity.maxMembers} confirmados`
              : `${activity.members.length}/${activity.maxMembers} miembros`
            }
          </span>
        </div>
        
        {activity.requirements && activity.requirements.length > 0 && (
          <div className="text-sm">
            <span className="text-dark-300">Requisitos: </span>
            <span className="font-semibold">{activity.requirements.join(', ')}</span>
          </div>
        )}
        
        {activity.rewards && (
          <div className="text-sm">
            <span className="text-dark-300">Recompensas: </span>
            <span className="font-semibold text-gold-400">{activity.rewards}</span>
          </div>
        )}
      </div>

      {showActions && (
        <div className="mt-6 flex gap-2">
          {isEvent ? (
            <>
              <button 
                onClick={handleConfirmAttendance}
                className="btn btn-success flex-1"
                disabled={activity.confirmedMembers?.length >= activity.maxMembers}
              >
                <CheckCircle size={16} />
                Confirmar
              </button>
              <button 
                onClick={handleCancelAttendance}
                className="btn btn-danger flex-1"
              >
                <XCircle size={16} />
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onEdit && onEdit(activity)}
                className="btn btn-secondary flex-1"
              >
                <Edit size={16} />
                Editar
              </button>
              <button 
                onClick={() => onDelete && onDelete(activity._id)}
                className="btn btn-danger flex-1"
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivityCard; 