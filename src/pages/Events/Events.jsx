import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import { eventsService } from '../../services/eventsService'
import { useNotification } from '../../contexts/NotificationContext'
import ActivityCard from '../../components/ActivityCard'
import CreateEvent from '../../components/CreateEvent';

const Events = () => {
  const { showNotification } = useNotification()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showCreateEvent, setShowCreateEvent] = useState(false)

  // Cargar eventos al montar el componente
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const eventsData = await eventsService.getEvents()
      setEvents(eventsData)
    } catch (error) {
      showNotification('Error al cargar eventos', 'error')
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (newEvent) => {
    try {
      const createdEvent = await eventsService.createEvent(newEvent)
      setEvents(prev => [createdEvent, ...prev])
      showNotification('Evento creado exitosamente', 'success')
      setShowCreateEvent(false)
    } catch (error) {
      showNotification('Error al crear evento', 'error')
    }
  }

  const handleConfirmAttendance = async (eventId, userData) => {
    try {
      const updatedEvent = await eventsService.confirmAttendance(eventId, userData)
      setEvents(prev => prev.map(event => 
        event._id === updatedEvent._id ? updatedEvent : event
      ))
      showNotification('Asistencia confirmada', 'success')
    } catch (error) {
      showNotification('Error al confirmar asistencia', 'error')
    }
  }

  const handleCancelAttendance = async (eventId, userId) => {
    try {
      const updatedEvent = await eventsService.cancelAttendance(eventId, userId)
      setEvents(prev => prev.map(event => 
        event._id === updatedEvent._id ? updatedEvent : event
      ))
      showNotification('Asistencia cancelada', 'success')
    } catch (error) {
      showNotification('Error al cancelar asistencia', 'error')
    }
  }

  const statuses = [
    { id: 'all', name: 'Todos', color: 'text-dark-300' },
    { id: 'Programado', name: 'Programados', color: 'text-blue-400' },
    { id: 'En Preparación', name: 'En Preparación', color: 'text-yellow-400' },
    { id: 'Activo', name: 'Activos', color: 'text-green-400' },
    { id: 'Completado', name: 'Completados', color: 'text-purple-400' },
    { id: 'Cancelado', name: 'Cancelados', color: 'text-red-400' }
  ]

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || event.eventStatus === selectedStatus
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 glow">📅</div>
          <h2 className="text-2xl font-bold text-gradient">Cargando eventos...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Eventos Programados</h1>
          <p className="text-xl text-dark-300">
            Programa eventos con fecha y hora específica. Los miembros pueden confirmar su asistencia.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              {statuses.map(status => (
                <button
                  key={status.id}
                  onClick={() => setSelectedStatus(status.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    selectedStatus === status.id
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                      : 'bg-dark-700/50 text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  {status.name}
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowCreateEvent(true)}
              className="btn btn-primary"
            >
              <Plus size={20} />
              Crear Evento
            </button>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No hay eventos programados</h3>
            <p className="text-gray-400">Crea tu primer evento para comenzar a organizar actividades</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <ActivityCard
                key={event._id}
                activity={event}
                type="event"
                onConfirmAttendance={handleConfirmAttendance}
                onCancelAttendance={handleCancelAttendance}
              />
            ))}
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateEvent && (
          <CreateEvent
            onClose={() => setShowCreateEvent(false)}
            onCreateEvent={handleCreateEvent}
          />
        )}
      </div>
    </div>
  )
}

export default Events 