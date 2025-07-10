import { useState } from 'react'
import { Plus, Search, Copy, Edit, Trash2 } from 'lucide-react'

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Plantillas de grupos (usando los datos del archivo group-templates.json)
  const templates = [
    {
      id: 'dungeon-5',
      name: 'Dungeon 5 Jugadores',
      description: 'Grupo estándar para dungeons de 5 jugadores',
      category: 'PvE',
      maxMembers: 5,
      roles: [
        { name: 'Tanque', required: 1, max: 1, icon: '🛡️' },
        { name: 'Sanador', required: 1, max: 1, icon: '💚' },
        { name: 'DPS Melee', required: 1, max: 2, icon: '⚔️' },
        { name: 'DPS Ranged', required: 1, max: 2, icon: '🏹' }
      ],
      icon: '🛡️'
    },
    {
      id: 'dungeon-10',
      name: 'Dungeon 10 Jugadores',
      description: 'Grupo para dungeons grandes de 10 jugadores',
      category: 'PvE',
      maxMembers: 10,
      roles: [
        { name: 'Tanque Principal', required: 1, max: 1, icon: '🛡️' },
        { name: 'Tanque Secundario', required: 1, max: 1, icon: '🛡️' },
        { name: 'Sanador Principal', required: 1, max: 1, icon: '💚' },
        { name: 'Sanador Secundario', required: 1, max: 1, icon: '💚' },
        { name: 'DPS Melee', required: 2, max: 4, icon: '⚔️' },
        { name: 'DPS Ranged', required: 2, max: 4, icon: '🏹' }
      ],
      icon: '🛡️'
    },
    {
      id: 'gvg-20',
      name: 'GvG 20 Jugadores',
      description: 'Guerra de gremios estándar',
      category: 'PvP',
      maxMembers: 20,
      roles: [
        { name: 'Tanque', required: 3, max: 5, icon: '🛡️' },
        { name: 'Sanador', required: 4, max: 6, icon: '💚' },
        { name: 'DPS Melee', required: 6, max: 8, icon: '⚔️' },
        { name: 'DPS Ranged', required: 4, max: 6, icon: '🏹' },
        { name: 'Soporte', required: 3, max: 5, icon: '🔮' }
      ],
      icon: '⚔️'
    },
    {
      id: 'hce-5',
      name: 'HCE 5 Jugadores',
      description: 'Hardcore Expeditions',
      category: 'PvE',
      maxMembers: 5,
      roles: [
        { name: 'Tanque', required: 1, max: 1, icon: '🛡️' },
        { name: 'Sanador', required: 1, max: 1, icon: '💚' },
        { name: 'DPS', required: 3, max: 3, icon: '⚔️' }
      ],
      icon: '🔥'
    },
    {
      id: 'gathering-10',
      name: 'Gathering 10 Jugadores',
      description: 'Recolección en grupo',
      category: 'Gathering',
      maxMembers: 10,
      roles: [
        { name: 'Recolector', required: 8, max: 10, icon: '🌿' },
        { name: 'Protector', required: 2, max: 2, icon: '🛡️' }
      ],
      icon: '🌿'
    },
    {
      id: 'crafting-5',
      name: 'Crafting 5 Jugadores',
      description: 'Crafteo especializado',
      category: 'Crafting',
      maxMembers: 5,
      roles: [
        { name: 'Crafteador', required: 3, max: 4, icon: '🔨' },
        { name: 'Recolector', required: 1, max: 2, icon: '🌿' }
      ],
      icon: '🔨'
    }
  ]

  const categories = [
    { id: 'all', name: 'Todas', icon: '📋' },
    { id: 'pve', name: 'PvE', icon: '🛡️' },
    { id: 'pvp', name: 'PvP', icon: '⚔️' },
    { id: 'gathering', name: 'Recolección', icon: '🌿' },
    { id: 'crafting', name: 'Crafting', icon: '🔨' }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || 
                           template.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

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

            <button className="btn btn-primary">
              <Plus size={20} />
              Crear Plantilla
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <div key={template.id} className="card group hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{template.icon}</div>
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-dark-700 rounded" title="Copiar plantilla">
                    <Copy size={16} className="text-dark-400" />
                  </button>
                  <button className="p-1 hover:bg-dark-700 rounded" title="Editar plantilla">
                    <Edit size={16} className="text-dark-400" />
                  </button>
                  <button className="p-1 hover:bg-dark-700 rounded" title="Eliminar plantilla">
                    <Trash2 size={16} className="text-dark-400" />
                  </button>
                </div>
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
                    {template.roles.map((role, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span>{role.icon}</span>
                          {role.name}
                        </span>
                        <span className="text-dark-400">
                          {role.required}-{role.max}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button className="btn btn-secondary flex-1">
                  <Copy size={16} />
                  Usar Plantilla
                </button>
                <button className="btn btn-primary flex-1">
                  <Edit size={16} />
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
            <button className="btn btn-primary">
              <Plus size={20} />
              Crear Primera Plantilla
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Templates 