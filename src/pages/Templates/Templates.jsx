import { useState, useEffect } from 'react'
import { Plus, Search, X, Edit } from 'lucide-react'
import { groupsService } from '../../services/groupsService'

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [creatingTemplate, setCreatingTemplate] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'PvE',
    icon: '🛡️',
    maxMembers: 5,
    roles: []
  })

  // Mapeo de iconos por nombre de rol
  const roleIconMap = {
    'Tanque': '🛡️',
    'Sanador': '💚',
    'DPS': '⚔️',
    'Soporte': '🔮',
    'Recolector': '🌿',
    'Crafteador': '🔨'
  };

  const [newRole, setNewRole] = useState({
    name: 'Tanque',
    count: 1
  })

  useEffect(() => {
    setLoading(true)
    groupsService.getTemplates()
      .then(data => {
        setTemplates(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Error al cargar plantillas')
        setLoading(false)
      })
  }, [])

  const categories = [
    { id: 'all', name: 'Todas', icon: '📋' },
    { id: 'pve', name: 'PvE', icon: '🛡️' },
    { id: 'pvp', name: 'PvP', icon: '⚔️' },
    { id: 'gathering', name: 'Recolección', icon: '🌿' },
    { id: 'crafting', name: 'Crafting', icon: '🔨' }
  ]

  const categoryOptions = [
    { value: 'PvE', label: 'PvE' },
    { value: 'PvP', label: 'PvP' },
    { value: 'Gathering', label: 'Recolección' },
    { value: 'Crafting', label: 'Crafting' }
  ]

  const iconOptions = [
    { value: '🛡️', label: 'Escudo' },
    { value: '⚔️', label: 'Espada' },
    { value: '🏹', label: 'Arco' },
    { value: '💚', label: 'Sanación' },
    { value: '🔮', label: 'Magia' },
    { value: '🌿', label: 'Naturaleza' },
    { value: '🔨', label: 'Herramienta' },
    { value: '🔥', label: 'Fuego' },
    { value: '⚡', label: 'Rayo' },
    { value: '👥', label: 'Grupo' }
  ]

  const roleIconOptions = [
    { value: '🛡️', label: 'Tanque' },
    { value: '💚', label: 'Sanador' },
    { value: '⚔️', label: 'DPS' },
    { value: '🏹', label: 'Ranged' },
    { value: '🔮', label: 'Soporte' },
    { value: '🌿', label: 'Recolector' },
    { value: '🔨', label: 'Crafteador' }
  ]

  const roleNameOptions = [
    { value: 'Tanque', label: 'Tanque' },
    { value: 'Sanador', label: 'Sanador' },
    { value: 'DPS', label: 'DPS' },
    { value: 'Soporte', label: 'Soporte' },
    { value: 'Recolector', label: 'Recolector' },
    { value: 'Crafteador', label: 'Crafteador' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' ||
      (template.category && template.category.toLowerCase() === selectedCategory)
    return matchesSearch && matchesCategory
  })

  const handleCreateTemplate = async (e) => {
    e.preventDefault()
    if (!newTemplate.name || newTemplate.roles.length === 0) {
      alert('Por favor completa el nombre y agrega al menos un rol')
      return
    }

    setCreatingTemplate(true)
    try {
      // Asegurar que los roles tengan count
      const roles = newTemplate.roles.map(r => ({
        name: r.name,
        icon: r.icon,
        count: r.count || 1
      }))
      // Agregar el campo type basado en la categoría
      const templateWithType = {
        ...newTemplate,
        type: newTemplate.category,
        roles
      }
      
      const createdTemplate = await groupsService.createTemplate(templateWithType)
      setTemplates(prev => [...prev, createdTemplate])
      setShowCreateModal(false)
      setNewTemplate({
        name: '',
        category: 'PvE',
        icon: '🛡️',
        maxMembers: 5,
        roles: []
      })
      setNewRole({
        name: 'Tanque'
      })
    } catch (error) {
      alert('Error al crear la plantilla')
    } finally {
      setCreatingTemplate(false)
    }
  }

  const handleEditTemplate = async (e) => {
    e.preventDefault()
    if (!selectedTemplate.name || selectedTemplate.roles.length === 0) {
      alert('Por favor completa el nombre y agrega al menos un rol')
      return
    }

    setEditingTemplate(true)
    try {
      const templateId = selectedTemplate._id || selectedTemplate.id
      // Asegurar que los roles solo tengan name, icon y count
      const roles = selectedTemplate.roles.map(r => ({
        name: r.name,
        icon: r.icon,
        count: r.count || 1
      }))
      // Asegurar que tenga el campo type
      const templateWithType = {
        ...selectedTemplate,
        type: selectedTemplate.type || selectedTemplate.category,
        roles
      }
      const updatedTemplate = await groupsService.updateTemplate(templateId, templateWithType)
      setTemplates(prev => prev.map(t => (t._id || t.id) === templateId ? updatedTemplate : t))
      setShowEditModal(false)
      setSelectedTemplate(null)
    } catch (error) {
      alert('Error al actualizar la plantilla')
    } finally {
      setEditingTemplate(false)
    }
  }

  const handlePersonalizeTemplate = (template) => {
    setSelectedTemplate({ ...template })
    setShowEditModal(true)
  }

  const addRole = () => {
    if (!newRole.name) {
      alert('Por favor selecciona el nombre del rol')
      return
    }
    if ((showEditModal ? selectedTemplate.roles.length : newTemplate.roles.length) >= (showEditModal ? selectedTemplate.maxMembers : newTemplate.maxMembers)) {
      alert('No puedes agregar más roles que el máximo de miembros')
      return
    }
    const icon = roleIconMap[newRole.name] || '';
    const roleToAdd = { name: newRole.name, icon };
    if (showEditModal) {
      setSelectedTemplate(prev => ({
        ...prev,
        roles: [...prev.roles, roleToAdd]
      }))
    } else {
      setNewTemplate(prev => ({
        ...prev,
        roles: [...prev.roles, roleToAdd]
      }))
    }
    setNewRole({
      name: 'Tanque'
    })
  }

  const removeRole = (index) => {
    if (showEditModal) {
      setSelectedTemplate(prev => ({
        ...prev,
        roles: prev.roles.filter((_, i) => i !== index)
      }))
    } else {
      setNewTemplate(prev => ({
        ...prev,
        roles: prev.roles.filter((_, i) => i !== index)
      }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚔️</div>
          <h2 className="text-2xl font-bold text-gradient">Cargando plantillas...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gradient">{error}</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gradient">Plantillas de Grupos</h1>
          <p className="text-xl text-dark-300">
            Plantillas predefinidas para diferentes tipos de actividades en Albion Online
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
                  placeholder="Buscar plantillas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                      : 'bg-dark-700/50 text-dark-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              Crear Plantilla
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id || template._id} className="card group hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{template.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-2">{template.name}</h3>
              <p className="text-dark-300 mb-4">{template.description}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-300">Categoría:</span>
                  <span className="font-semibold">{template.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-300">Miembros:</span>
                  <span className="font-semibold">{template.maxMembers}</span>
                </div>
                <div className="text-sm">
                  <span className="text-dark-300">Roles:</span>
                  <div className="mt-2 space-y-1">
                    {template.roles && template.roles.map((role, index) => (
                      <div key={`${template.id || template._id}-role-${index}`} className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span>{role.icon}</span>
                          {role.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-2">
                <button 
                  className="btn btn-primary flex-1" 
                  onClick={() => handlePersonalizeTemplate(template)}
                >
                  <Edit size={16} className="mr-2" />
                  Personalizar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-2">No se encontraron plantillas</h3>
            <p className="text-dark-300 mb-6">
              {searchTerm || selectedCategory !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Crea tu primera plantilla para comenzar'
              }
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={20} />
              Crear Primera Plantilla
            </button>
          </div>
        )}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <Plus className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Crear Nueva Plantilla</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateTemplate} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre</label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Ej: Dungeon 5 Jugadores"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Categoría</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Icono</label>
                  <select
                    value={newTemplate.icon}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label} {option.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Máximo de Miembros</label>
                  <input
                    type="number"
                    value={newTemplate.maxMembers}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    min="1"
                    max="50"
                    required
                  />
                </div>
              </div>

              {/* Roles Section */}
              <div>
                <label className="block text-sm font-semibold mb-4">Roles</label>
                
                {/* Add Role Form */}
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="grid md:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Nombre</label>
                      <select
                        value={newRole.name}
                        onChange={(e) => setNewRole({ name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      >
                        {roleNameOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addRole}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                    disabled={(newTemplate.roles.length) >= (newTemplate.maxMembers)}
                  >
                    Agregar Rol
                  </button>
                </div>

                {/* Roles List */}
                {(newTemplate.roles.length > 0) && (
                  <div className="space-y-2">
                    {newTemplate.roles.map((role, index) => (
                      <div key={`role-${index}`} className="flex items-center justify-between bg-gray-800 rounded p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{role.icon}</span>
                          <span className="font-medium">{role.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRole(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={creatingTemplate}
                >
                  {creatingTemplate ? 'Creando...' : 'Crear Plantilla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Template Modal */}
      {showEditModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <Edit className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Personalizar Plantilla</h2>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditTemplate} className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre</label>
                  <input
                    type="text"
                    value={selectedTemplate.name}
                    onChange={(e) => setSelectedTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Ej: Dungeon 5 Jugadores"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Categoría</label>
                  <select
                    value={selectedTemplate.category}
                    onChange={(e) => setSelectedTemplate(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Icono</label>
                  <select
                    value={selectedTemplate.icon}
                    onChange={(e) => setSelectedTemplate(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label} {option.value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Máximo de Miembros</label>
                  <input
                    type="number"
                    value={selectedTemplate.maxMembers}
                    onChange={(e) => setSelectedTemplate(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    min="1"
                    max="50"
                    required
                  />
                </div>
              </div>

              {/* Roles Section */}
              <div>
                <label className="block text-sm font-semibold mb-4">Roles</label>
                
                {/* Add Role Form */}
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="grid md:grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Nombre</label>
                      <select
                        value={newRole.name}
                        onChange={(e) => setNewRole({ name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      >
                        {roleNameOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addRole}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                    disabled={(selectedTemplate.roles.length) >= (selectedTemplate.maxMembers)}
                  >
                    Agregar Rol
                  </button>
                </div>

                {/* Roles List */}
                {(selectedTemplate.roles.length > 0) && (
                  <div className="space-y-2">
                    {selectedTemplate.roles.map((role, index) => (
                      <div key={`edit-role-${index}`} className="flex items-center justify-between bg-gray-800 rounded p-3">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{role.icon}</span>
                          <span className="font-medium">{role.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRole(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={editingTemplate}
                >
                  {editingTemplate ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Templates 