import React from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { groupsService } from '../../services/groupsService'
import { useState, useEffect } from 'react'
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
  const [selectedTemplate, setSelectedTemplate] = useState(null) // Agregado el estado faltante
  const { forceShowNotification } = useGroupCompletion(groups, user);

  // Plantillas dinámicas
  const [templates, setTemplates] = useState([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [errorTemplates, setErrorTemplates] = useState(null)

  useEffect(() => {
    setLoadingTemplates(true)
    groupsService.getTemplates()
      .then(data => {
        setTemplates(data)
        setLoadingTemplates(false)
      })
      .catch(() => {
        setErrorTemplates('Error al cargar plantillas')
        setLoadingTemplates(false)
      })
  }, [])

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
    if (!selectedTemplate || !selectedRole) {
      showNotification('Selecciona una plantilla y un rol', 'error')
      return
    }
    
    const available = findGroupsByActivityAndRole(selectedTemplate.type, selectedRole)
    
    if (available.length === 0) {
      showNotification(`No hay grupos de ${selectedTemplate.type} con slots de ${selectedRole} disponibles`, 'info')
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
        setSelectedTemplate(null)
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

  // Función para crear grupo automáticamente
  const handleAutoCreateGroup = async () => {
    if (!selectedTemplate || !selectedRole) {
      showNotification('Selecciona una plantilla y un rol', 'error')
      return
    }
    
    const groupName = `${user.albionNick} ${selectedTemplate.name}`;
    let assigned = false;
    const slots = (selectedTemplate.roles || []).map((role) => {
      const roleName = role.name || role;
      if (!assigned && roleName === selectedRole) {
        assigned = true;
        return { role: roleName, user: { albionNick: user.albionNick, username: user.albionNick } };
      }
      return { role: roleName, user: null };
    });

    // Asegura que el campo type nunca sea undefined
    const groupType = selectedTemplate.type || selectedTemplate.category || selectedTemplate.name;

    const newGroup = {
      name: groupName,
      template: selectedTemplate,
      type: groupType,
      slots,
      creatorNick: user.albionNick,
    };
    
    try {
      await groupsService.createGroup(newGroup);
      showNotification('Grupo creado exitosamente', 'success');
      setShowJoinModal(false);
      setSelectedTemplate(null);
      setSelectedRole('');
      // No recargar grupos, el socket lo hará
      navigate('/groups'); // Navegar a la página de grupos
    } catch (error) {
      showNotification('Error al crear grupo', 'error');
    }
  };

  // Opciones para el modal
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
                  setSelectedTemplate(null)
                  setSelectedRole('')
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Plantillas disponibles */}
              <div>
                <label className="block text-lg font-medium text-white mb-4">
                  ¿Qué tipo de aventura quieres vivir?
                </label>
                {loadingTemplates ? (
                  <div className="text-center py-8 text-gray-400">Cargando plantillas...</div>
                ) : errorTemplates ? (
                  <div className="text-center py-8 text-red-400">{errorTemplates}</div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold mb-2">No hay plantillas creadas</h3>
                    <p className="text-gray-400 mb-4">Crea tu primera plantilla para comenzar a organizar aventuras</p>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        setShowJoinModal(false)
                        // Redirigir a la página de plantillas o abrir el modal de crear plantilla
                        window.location.href = '/templates'
                      }}
                    >
                      Crear Plantilla
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <button
                        key={template.id || template._id}
                        onClick={() => {
                          setSelectedTemplate(template)
                          setSelectedRole('')
                        }}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedTemplate && (selectedTemplate.id || selectedTemplate._id) === (template.id || template._id)
                            ? 'border-green-500 bg-green-500/10 text-green-400'
                            : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                        }`}
                      >
                        <div className="text-3xl mb-2">{template.icon}</div>
                        <div className="font-semibold mb-1">{template.name}</div>
                        <div className="text-xs opacity-75">{template.category}</div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {template.roles && template.roles.map((role, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 text-xs bg-dark-700/50 rounded px-2 py-1">
                              <span>{role.icon}</span>
                              {role.name}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Rol */}
              {selectedTemplate && (
                <div>
                  <label className="block text-lg font-medium text-white mb-4">
                    ⚔️ ¿Con qué rol quieres luchar?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from(new Set((selectedTemplate.roles || []).map(r => r.name))).map((roleName) => {
                      const roleIcon = (selectedTemplate.roles.find(r => r.name === roleName) || {}).icon || '';
                      return (
                        <button
                          key={roleName}
                          onClick={() => setSelectedRole(roleName)}
                          className={`p-4 rounded-lg border-2 transition-all text-center ${
                            selectedRole === roleName
                              ? 'border-green-500 bg-green-500/10 text-green-400'
                              : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                          }`}
                        >
                          <div className="text-3xl mb-2">{roleIcon}</div>
                          <div className="font-semibold mb-1">{roleName}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Información de grupos disponibles */}
              {selectedTemplate && selectedRole && (
                <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <div className="text-lg font-semibold text-white mb-2">
                      {findGroupsByActivityAndRole(
                        selectedTemplate.type || selectedTemplate.category || selectedTemplate.name,
                        selectedRole
                      ).length > 0
                        ? `¡Perfecto! Encontramos ${findGroupsByActivityAndRole(
                            selectedTemplate.type || selectedTemplate.category || selectedTemplate.name,
                            selectedRole
                          ).length} grupos disponibles`
                        : `No hay grupos de ${selectedTemplate.type || selectedTemplate.category || selectedTemplate.name} con slots de ${selectedRole} disponibles`}
                    </div>
                    <div className="text-gray-300">
                      Grupos de <strong>{selectedTemplate.type || selectedTemplate.category || selectedTemplate.name}</strong> con slots de <strong>{selectedRole}</strong>
                    </div>
                    {findGroupsByActivityAndRole(
                      selectedTemplate.type || selectedTemplate.category || selectedTemplate.name,
                      selectedRole
                    ).length > 0 ? (
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
                        Crear Grupo de {selectedTemplate.type || selectedTemplate.category || selectedTemplate.name} como {selectedRole}
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
                  setSelectedTemplate(null)
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