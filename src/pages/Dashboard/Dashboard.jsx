import React from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { groupsService } from '../../services/groupsService'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Calendar, 
  Calculator, 
  TrendingUp, 
  Star,
  Activity,
  Award,
  Target,
  Eye,
  LogOut,
  Search,
  X
} from 'lucide-react'
import ActivityTypeInfo from '../../components/ActivityTypeInfo'
import useGroupCompletion from '../../hooks/useGroupCompletion';
import { useGroupsStore } from '../../store/useGroupsStore';
import { useGroupsSocket } from '../../hooks/useGroupsSocket';

const Dashboard = () => {
  useGroupsSocket(); // Ahora el socket está activo en todo el Dashboard

  const { user } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const groups = useGroupsStore(state => state.groups)
  const [userActiveGroup, setUserActiveGroup] = useState(null)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const { forceShowNotification } = useGroupCompletion(groups, user);

  // Buscar grupo activo del usuario
  React.useEffect(() => {
    const activeGroup = groups.find(group =>
      group.status === 'Activo' &&
      group.slots && group.slots.some(slot => 
        slot.user && slot.user.albionNick === user?.albionNick
      )
    )
    setUserActiveGroup(activeGroup)
  }, [groups, user])

  // Función para buscar grupos según actividad y rol seleccionados
  const findGroupsByActivityAndRole = (activity, role) => {
    return groups.filter(group => {
      if (group.status !== 'Activo') return false
      if (activity && group.type !== activity) return false
      
      const availableSlots = group.slots && group.slots.filter(slot => 
        !slot.user && slot.role === role
      )
      
      return availableSlots && availableSlots.length > 0
    })
  }

  // Función para salirse del grupo activo
  const handleLeaveActiveGroup = async () => {
    if (!userActiveGroup) return

    try {
      await groupsService.removeMemberFromGroup(userActiveGroup._id, user.albionNick)
      showNotification('Te has salido del grupo exitosamente', 'success')
      // No recargar grupos, el socket lo hará
    } catch (error) {
      showNotification('Error al salirse del grupo', 'error')
    }
  }

  // Función para unirse al primer grupo disponible según criterios
  const handleAutoJoin = async () => {
    if (!selectedActivity || !selectedRole) {
      showNotification('Selecciona una actividad y un rol', 'error')
      return
    }
    
    const available = findGroupsByActivityAndRole(selectedActivity, selectedRole)
    
    if (available.length === 0) {
      showNotification(`No hay grupos de ${selectedActivity} con slots de ${selectedRole} disponibles`, 'info')
      return
    }
    
    const targetGroup = available[0]
    // Buscar el slot correcto para el rol seleccionado
    const availableSlot = targetGroup.slots.find(slot => 
      !slot.user && slot.role === selectedRole
    )
    
    if (availableSlot) {
      try {
        await groupsService.addMemberToGroup(targetGroup._id, { 
          albionNick: user.albionNick, 
          username: user.albionNick,
          role: selectedRole // Aseguramos que el backend use el slot correcto
        })
        showNotification(`¡Te has unido a ${targetGroup.name} como ${selectedRole}!`, 'success')
        // No recargar grupos, el socket lo hará
        // Si el grupo quedó lleno, mostrar modal
        const updatedGroup = groups.find(g => g._id === targetGroup._id);
        if (updatedGroup && updatedGroup.slots.filter(s => s.user).length === updatedGroup.slots.length) {
          forceShowNotification(updatedGroup);
        }
        setShowJoinModal(false)
        setSelectedActivity('')
        setSelectedRole('')
        navigate('/groups') // Redirigir a la página de grupos
      } catch (error) {
        const backendMsg = error?.response?.data?.error || error.message
        if (backendMsg.toLowerCase().includes('ya perteneces a otro grupo')) {
          showNotification('Ya perteneces a otro grupo activo', 'error')
        } else {
          showNotification('Error al unirse al grupo', 'error')
        }
      }
    }
  }

  // Plantillas reales (debería estar en un archivo común, pero la traemos aquí para el flujo automático)
  const templates = [
    {
      id: 1,
      name: 'Dungeon 5v5',
      type: 'Dungeon',
      maxMembers: 5,
      roles: ['Tanque', 'Sanador', 'DPS', 'DPS', 'DPS']
    },
    {
      id: 2,
      name: 'GvG 5v5',
      type: 'GvG',
      maxMembers: 5,
      roles: ['Tanque', 'Sanador', 'DPS', 'DPS', 'DPS']
    },
    {
      id: 3,
      name: 'HCE 5v5',
      type: 'HCE',
      maxMembers: 5,
      roles: ['Tanque', 'Sanador', 'DPS', 'DPS', 'DPS']
    },
    {
      id: 4,
      name: 'ZvZ Masivo',
      type: 'ZvZ',
      maxMembers: 20,
      roles: ['Tanque', 'Sanador', 'DPS', 'Soporte']
    },
    {
      id: 5,
      name: 'Gathering Group',
      type: 'Gathering',
      maxMembers: 10,
      roles: ['Recolector']
    }
  ];

  // Función para crear grupo automáticamente
  const handleAutoCreateGroup = async () => {
    if (!selectedActivity || !selectedRole) {
      showNotification('Selecciona una actividad y un rol', 'error')
      return
    }
    // Buscar plantilla real de la actividad
    const template = templates.find(t => t.type === selectedActivity) || {
      name: `${selectedActivity} Auto`,
      type: selectedActivity,
      roles: [selectedRole],
    };
    // Nombre automático
    const groupName = `${user.albionNick} ${selectedActivity}`;
    // Crear slots según plantilla, asignando al usuario solo al primer slot disponible del rol seleccionado
    let assigned = false;
    const slots = template.roles.map((role) => {
      if (!assigned && role === selectedRole) {
        assigned = true;
        return { role, user: { albionNick: user.albionNick, username: user.albionNick } };
      }
      return { role, user: null };
    });
    const newGroup = {
      name: groupName,
      template: template,
      type: selectedActivity,
      slots,
      creatorNick: user.albionNick,
    };
    try {
      await groupsService.createGroup(newGroup);
      showNotification('Grupo creado exitosamente', 'success');
      setShowJoinModal(false);
      setSelectedActivity('');
      setSelectedRole('');
      // No recargar grupos, el socket lo hará
      navigate('/groups'); // Navegar a la página de grupos
    } catch (error) {
      showNotification('Error al crear grupo', 'error');
    }
  };

  // Opciones para el modal
  const activityTypes = [
    { value: 'Dungeon', label: 'Dungeon', icon: '🏰', description: 'Explora mazmorras y obtén tesoros' },
    { value: 'GvG', label: 'GvG', icon: '⚔️', description: 'Batallas épicas entre gremios' },
    { value: 'HCE', label: 'HCE', icon: '🔥', description: 'Hardcore Expeditions de élite' },
    { value: 'ZvZ', label: 'ZvZ', icon: '👥', description: 'Guerras masivas de territorios' },
    { value: 'Gathering', label: 'Gathering', icon: '🌿', description: 'Recolección de recursos' },
    { value: 'Crafting', label: 'Crafting', icon: '🔨', description: 'Creación de objetos' },
    { value: 'PvP', label: 'PvP', icon: '⚡', description: 'Combate jugador vs jugador' }
  ]

  const roleTypes = [
    { value: 'Tanque', label: 'Tanque', icon: '🛡️', description: 'Protege al grupo' },
    { value: 'Sanador', label: 'Sanador', icon: '💚', description: 'Mantén vivos a tus aliados' },
    { value: 'DPS', label: 'DPS', icon: '⚔️', description: 'Inflige daño devastador' },
    { value: 'Soporte', label: 'Soporte', icon: '🔮', description: 'Potencia las habilidades del grupo' }
  ]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl font-bold mb-2">
            ¡Bienvenido, <span className="text-gradient">{user?.albionNick || user?.username || 'Aventurero'}</span>!
          </h1>
          <p className="text-xl text-dark-300">
            Aquí tienes un resumen de tu actividad en Albion Group Manager
          </p>
        </div>

        {/* Botón Principal de Grupo */}
        {!userActiveGroup ? (
          <div className="card bg-gradient-to-r from-green-600/20 to-blue-600/20 border-green-500/30 mb-12 fade-in">
            <div className="text-center">
              <div className="text-6xl mb-4">⚔️</div>
              <h2 className="text-3xl font-bold text-gradient mb-4">
                ¡Únete a la Aventura!
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                ¿Listo para conquistar Albion? Encuentra tu grupo perfecto y embárcate en 
                misiones épicas. Desde mazmorras peligrosas hasta batallas masivas, 
                tu próxima gran aventura está a un clic de distancia.
              </p>
              <button
                onClick={() => setShowJoinModal(true)}
                className="btn btn-primary text-lg px-8 py-4 flex items-center space-x-3 mx-auto"
              >
                <Eye size={24} />
                <span>Buscar Grupo Épico</span>
                <Search size={24} />
              </button>
            </div>
          </div>
        ) : (
          <div className="card bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30 mb-12 fade-in">
            <div className="text-center">
              <div className="text-6xl mb-4">🛡️</div>
              <h2 className="text-3xl font-bold text-gradient mb-4">
                ¡Estás en Misión!
              </h2>
              <p className="text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
                Actualmente estás participando en <strong>{userActiveGroup.name}</strong>. 
                ¿Quieres cambiar de grupo o salirte para buscar nuevas aventuras?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleLeaveActiveGroup}
                  className="btn btn-danger text-lg px-6 py-3 flex items-center space-x-3"
                >
                  <LogOut size={20} />
                  <span>Salir del Grupo</span>
                </button>
                <button
                  onClick={() => {
                    handleLeaveActiveGroup()
                    setTimeout(() => setShowJoinModal(true), 500)
                  }}
                  className="btn btn-primary text-lg px-6 py-3 flex items-center space-x-3"
                >
                  <Eye size={20} />
                  <span>Cambiar de Grupo</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Eliminar el panel de acciones rápidas y los datos ficticios */}
        {/* Eliminar también los grids de stats, actividad reciente y próximos eventos */}

        {/* Si quieres dejar espacio para futuras secciones, puedes dejar un comentario aquí */}

        {/* Activity Type Info */}
        <ActivityTypeInfo />
      </div>

      {/* Modal de búsqueda de grupo */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <Search className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">¡Encuentra tu Aventura!</h2>
              </div>
              <button
                onClick={() => {
                  setShowJoinModal(false)
                  setSelectedActivity('')
                  setSelectedRole('')
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Tipo de Actividad */}
              <div>
                <label className="block text-lg font-medium text-white mb-4">
                   ¿Qué tipo de aventura quieres vivir?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {activityTypes.map((activity) => (
                    <button
                      key={activity.value}
                      onClick={() => setSelectedActivity(activity.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedActivity === activity.value
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className="text-3xl mb-2">{activity.icon}</div>
                      <div className="font-semibold mb-1">{activity.label}</div>
                      <div className="text-xs opacity-75">{activity.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rol */}
              <div>
                <label className="block text-lg font-medium text-white mb-4">
                  ⚔️ ¿Con qué rol quieres luchar?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {roleTypes.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        selectedRole === role.value
                          ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                      }`}
                    >
                      <div className="text-3xl mb-2">{role.icon}</div>
                      <div className="font-semibold mb-1">{role.label}</div>
                      <div className="text-xs opacity-75">{role.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Información de grupos disponibles */}
              {selectedActivity && selectedRole && (
                <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-lg font-semibold text-white mb-2">
                      {findGroupsByActivityAndRole(selectedActivity, selectedRole).length > 0
                        ? `¡Perfecto! Encontramos ${findGroupsByActivityAndRole(selectedActivity, selectedRole).length} grupos disponibles`
                        : `No hay grupos de ${selectedActivity} con slots de ${selectedRole} disponibles`}
                    </div>
                    <div className="text-gray-300">
                      Grupos de <strong>{selectedActivity}</strong> con slots de <strong>{selectedRole}</strong>
                    </div>
                    {findGroupsByActivityAndRole(selectedActivity, selectedRole).length > 0 ? (
                      <button
                        onClick={handleAutoJoin}
                        className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                      >
                        Unirse a Grupo
                      </button>
                    ) : (
                      <button
                        onClick={handleAutoCreateGroup}
                        className="mt-4 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition-all"
                      >
                        Crear Grupo de {selectedActivity} como {selectedRole}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowJoinModal(false)
                  setSelectedActivity('')
                  setSelectedRole('')
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 