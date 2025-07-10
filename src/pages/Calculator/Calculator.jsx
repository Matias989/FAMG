import { useState, useEffect } from 'react'
import { useNotification } from '../../contexts/NotificationContext'
import { Calculator as CalculatorIcon, Coins, Users, Settings, TrendingUp, RefreshCw, Search, UserPlus, X, Info } from 'lucide-react'
import UserSearchModal from '../../components/UserSearchModal'
import UserStatsPanel from '../../components/UserStatsPanel'
import UserProfile from '../../components/UserProfile'

const Calculator = () => {
  const { showNotification } = useNotification()
  
  // Estados
  const [totalLoot, setTotalLoot] = useState('')
  const [repairCosts, setRepairCosts] = useState('0')
  const [memberCount, setMemberCount] = useState('4')
  const [distributionMode, setDistributionMode] = useState('equal')
  const [members, setMembers] = useState([])
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [financialSummary, setFinancialSummary] = useState({
    total: 0,
    repair: 0,
    net: 0
  })

  // Estados para búsqueda de usuarios
  const [showUserSearch, setShowUserSearch] = useState(null) // ID del campo activo
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [showUserStats, setShowUserStats] = useState(false)
  const [selectedUserForStats, setSelectedUserForStats] = useState(null)
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [selectedUserForProfile, setSelectedUserForProfile] = useState(null)

  // Usuarios simulados registrados
  const registeredUsers = [
    { 
      id: 1, 
      username: 'TankMaster', 
      avatar: '🛡️', 
      role: 'Tanque', 
      level: 100, 
      experience: 'Experto',
      roles: [
        { role: 'Tanque', weapon: 'Espada y Escudo' },
        { role: 'Tanque', weapon: 'Martillo' }
      ],
      gathering: {
        'Mineral': 'T8',
        'Madera': 'T6',
        'Fibra': 'T5'
      }
    },
    { 
      id: 2, 
      username: 'HealPro', 
      avatar: '💚', 
      role: 'Sanador', 
      level: 95, 
      experience: 'Avanzado',
      roles: [
        { role: 'Sanador', weapon: 'Bastón Sagrado' },
        { role: 'Sanador', weapon: 'Bastón de Naturaleza' }
      ],
      gathering: {
        'Fibra': 'T7',
        'Piedra': 'T5'
      }
    },
    { 
      id: 3, 
      username: 'DPSKiller', 
      avatar: '⚔️', 
      role: 'DPS', 
      level: 88, 
      experience: 'Intermedio',
      roles: [
        { role: 'DPS Melee', weapon: 'Espada' },
        { role: 'DPS Melee', weapon: 'Daga' }
      ],
      gathering: {
        'Mineral': 'T6',
        'Madera': 'T4'
      }
    },
    { 
      id: 4, 
      username: 'RangedShot', 
      avatar: '🏹', 
      role: 'DPS Ranged', 
      level: 92, 
      experience: 'Avanzado',
      roles: [
        { role: 'DPS Ranged', weapon: 'Arco' },
        { role: 'DPS Ranged', weapon: 'Ballesta' }
      ],
      gathering: {
        'Madera': 'T7',
        'Piel': 'T5'
      }
    },
    { 
      id: 5, 
      username: 'SupportMage', 
      avatar: '🔮', 
      role: 'Soporte', 
      level: 85, 
      experience: 'Intermedio',
      roles: [
        { role: 'Soporte', weapon: 'Bastón Arcano' },
        { role: 'Soporte', weapon: 'Bastón de Naturaleza' }
      ],
      gathering: {
        'Fibra': 'T6',
        'Piedra': 'T4'
      }
    },
    { 
      id: 6, 
      username: 'Gatherer', 
      avatar: '🌿', 
      role: 'Recolector', 
      level: 100, 
      experience: 'Experto',
      roles: [],
      gathering: {
        'Mineral': 'T8',
        'Madera': 'T8',
        'Fibra': 'T8',
        'Piedra': 'T8',
        'Piel': 'T8',
        'Pescado': 'T7'
      }
    },
    { 
      id: 7, 
      username: 'CraftMaster', 
      avatar: '🔨', 
      role: 'Crafteador', 
      level: 98, 
      experience: 'Experto',
      roles: [],
      gathering: {
        'Mineral': 'T7',
        'Madera': 'T7',
        'Fibra': 'T7',
        'Piedra': 'T7'
      }
    },
    { 
      id: 8, 
      username: 'PvPWarrior', 
      avatar: '⚔️', 
      role: 'PvP', 
      level: 90, 
      experience: 'Avanzado',
      roles: [
        { role: 'DPS Melee', weapon: 'Espada' },
        { role: 'DPS Melee', weapon: 'Daga' },
        { role: 'DPS Ranged', weapon: 'Arco' }
      ],
      gathering: {
        'Mineral': 'T5',
        'Madera': 'T4'
      }
    },
    { 
      id: 9, 
      username: 'DungeonRunner', 
      avatar: '🛡️', 
      role: 'PvE', 
      level: 87, 
      experience: 'Intermedio',
      roles: [
        { role: 'Tanque', weapon: 'Espada y Escudo' },
        { role: 'DPS Melee', weapon: 'Espada' }
      ],
      gathering: {
        'Mineral': 'T6',
        'Madera': 'T5'
      }
    },
    { 
      id: 10, 
      username: 'HCEElite', 
      avatar: '🔥', 
      role: 'HCE', 
      level: 100, 
      experience: 'Experto',
      roles: [
        { role: 'Tanque', weapon: 'Martillo' },
        { role: 'Sanador', weapon: 'Bastón Sagrado' },
        { role: 'DPS Melee', weapon: 'Espada' }
      ],
      gathering: {
        'Mineral': 'T7',
        'Madera': 'T6',
        'Fibra': 'T6'
      }
    }
  ]

  // Generar campos de miembros cuando cambie el modo o cantidad
  useEffect(() => {
    if (distributionMode === 'custom') {
      generateMemberFields()
    } else {
      setMembers([])
    }
  }, [distributionMode, memberCount])

  // Actualizar resumen financiero
  useEffect(() => {
    updateFinancialSummary()
  }, [totalLoot, repairCosts])

  // Filtrar usuarios cuando cambie el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(registeredUsers)
    } else {
      const filtered = registeredUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.experience.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm])

  const generateMemberFields = () => {
    const count = parseInt(memberCount)
    if (isNaN(count) || count < 1 || count > 20) {
      setMembers([])
      return
    }

    const newMembers = []
    for (let i = 0; i < count; i++) {
      newMembers.push({
        id: i,
        name: '',
        participation: '',
        selectedUser: null
      })
    }
    setMembers(newMembers)
  }

  const updateFinancialSummary = () => {
    const total = parseFloat(totalLoot) || 0
    const repair = parseFloat(repairCosts) || 0
    const net = total - repair

    setFinancialSummary({ total, repair, net })
  }

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...members]
    newMembers[index][field] = value
    setMembers(newMembers)
  }

  const handleUserSearch = (memberIndex) => {
    setShowUserSearch(memberIndex)
    setSearchTerm('')
    setFilteredUsers(registeredUsers)
  }

  const selectUser = (user, memberIndex) => {
    const newMembers = [...members]
    newMembers[memberIndex] = {
      ...newMembers[memberIndex],
      name: user.username,
      selectedUser: user
    }
    setMembers(newMembers)
    setShowUserSearch(null)
    setSearchTerm('')
    showNotification(`Usuario ${user.username} seleccionado`, 'success')
  }

  const clearUserSelection = (memberIndex) => {
    const newMembers = [...members]
    newMembers[memberIndex] = {
      ...newMembers[memberIndex],
      name: '',
      selectedUser: null
    }
    setMembers(newMembers)
  }

  const handleUserStats = (user) => {
    setSelectedUserForStats(user)
    setShowUserStats(true)
  }

  const handleEditProfile = (user) => {
    setSelectedUserForProfile(user)
    setShowUserProfile(true)
  }

  const handleSaveProfile = (updatedUser) => {
    // Actualizar el usuario en la lista
    const updatedUsers = registeredUsers.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    )
    // En una aplicación real, aquí se guardaría en la base de datos
    console.log('Usuario actualizado:', updatedUser)
    showNotification('Perfil actualizado correctamente', 'success')
    setShowUserProfile(false)
    setSelectedUserForProfile(null)
  }

  const getSelectedUsersCount = () => {
    return members.filter(member => member.selectedUser).length
  }

  const validateForm = () => {
    if (!totalLoot || parseFloat(totalLoot) <= 0) {
      showNotification('Ingresa un monto válido de ganancias', 'error')
      return false
    }

    if (parseFloat(repairCosts) > parseFloat(totalLoot)) {
      showNotification('Los gastos de reparación no pueden ser mayores a las ganancias totales', 'error')
      return false
    }

    if (distributionMode === 'custom') {
      let totalParticipation = 0
      let allFilled = true
      let hasPositive = false

      members.forEach(member => {
        const participation = parseFloat(member.participation) || 0
        totalParticipation += participation
        if (participation > 0) hasPositive = true
        if (!member.name.trim() || member.participation === '') {
          allFilled = false
        }
      })

      if (!allFilled) {
        showNotification('Completa todos los campos de los integrantes', 'error')
        return false
      }

      if (!hasPositive) {
        showNotification('Debe haber al menos un aporte mayor a 0', 'error')
        return false
      }

      if (Math.abs(totalParticipation - 100) > 0.1) {
        showNotification(`La participación total debe ser 100% (actual: ${totalParticipation.toFixed(1)}%)`, 'error')
        return false
      }
    }

    return true
  }

  const calculateDistribution = () => {
    if (!validateForm()) return

    const total = parseFloat(totalLoot)
    const repair = parseFloat(repairCosts) || 0
    const net = total - repair

    let newResults = []

    if (distributionMode === 'equal') {
      const count = parseInt(memberCount)
      const amount = net / count
      
      for (let i = 0; i < count; i++) {
        newResults.push({
          name: `Integrante ${i + 1}`,
          participation: (100 / count).toFixed(1),
          amount: amount
        })
      }
    } else {
      // Distribución proporcional
      let totalAportes = 0
      members.forEach(member => {
        totalAportes += parseFloat(member.participation) || 0
      })

      members.forEach(member => {
        const name = member.name.trim()
        const participation = parseFloat(member.participation) || 0
        const amount = totalAportes > 0 ? (net * participation) / totalAportes : 0
        
        newResults.push({
          name: name,
          participation: participation,
          amount: amount
        })
      })
    }

    setResults(newResults)
    setShowResults(true)
    
    const modeText = distributionMode === 'equal' ? 'equitativa' : 'proporcional'
    showNotification(`Distribución ${modeText} calculada exitosamente`, 'success')
  }

  const resetCalculator = () => {
    setTotalLoot('')
    setRepairCosts('0')
    setMemberCount('4')
    setDistributionMode('equal')
    setMembers([])
    setResults([])
    setShowResults(false)
    setFinancialSummary({ total: 0, repair: 0, net: 0 })
    setShowUserSearch(null)
    setSearchTerm('')
    showNotification('Calculadora reiniciada', 'info')
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 glow">💰</div>
          <h1 className="text-4xl font-bold mb-4 text-gradient">Calculadora de Loot</h1>
          <p className="text-xl text-dark-300">Reparte ganancias equitativamente en Albion Online</p>
        </div>

        <div className="card">
          {/* Input Section */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                <Coins size={24} className="text-gold-400" />
                Total de Ganancias (Plata)
              </label>
              <input
                type="number"
                value={totalLoot}
                onChange={(e) => setTotalLoot(e.target.value)}
                placeholder="Ingresa el total de plata"
                className="input"
                min="0"
                step="1"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                <Settings size={24} className="text-gold-400" />
                Gastos de Reparación (Plata)
                <span className="text-sm text-dark-400 font-normal">(Opcional)</span>
              </label>
              <input
                type="number"
                value={repairCosts}
                onChange={(e) => setRepairCosts(e.target.value)}
                placeholder="0"
                className="input"
                min="0"
                step="1"
              />
              <small className="text-dark-400 text-sm mt-1 block">
                Deja en 0 si no hay gastos de reparación
              </small>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                <Users size={24} className="text-gold-400" />
                Número de Integrantes
              </label>
              <input
                type="number"
                value={memberCount}
                onChange={(e) => setMemberCount(e.target.value)}
                placeholder="Cantidad de miembros"
                className="input"
                min="1"
                max="20"
              />
            </div>

            {/* Distribution Options */}
            <div className="bg-dark-700/30 rounded-xl p-6 border border-dark-600/50">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CalculatorIcon size={24} className="text-gold-400" />
                Opciones de Distribución
              </h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setDistributionMode('equal')}
                  className={`btn flex-1 ${
                    distributionMode === 'equal' 
                      ? 'btn-primary' 
                      : 'btn-secondary'
                  }`}
                >
                  <TrendingUp size={20} />
                  Distribución Equitativa
                </button>
                <button
                  onClick={() => setDistributionMode('custom')}
                  className={`btn flex-1 ${
                    distributionMode === 'custom' 
                      ? 'btn-primary' 
                      : 'btn-secondary'
                  }`}
                >
                  <Users size={20} />
                  Participación Personalizada
                </button>
              </div>
              <small className="text-dark-400 text-sm mt-2 block">
                Elige si todos participan igual o con porcentajes diferentes
              </small>
            </div>
          </div>

          {/* Members Section */}
          {distributionMode === 'custom' && members.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Users size={24} className="text-gold-400" />
                  Participación por Integrante
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowUserStats(!showUserStats)}
                    className="btn btn-secondary btn-sm"
                    title="Ver estadísticas de usuarios"
                  >
                    <Info size={16} />
                    {showUserStats ? 'Ocultar' : 'Mostrar'} Stats
                  </button>
                  <div className="text-sm text-dark-300">
                    {getSelectedUsersCount()}/{members.length} usuarios seleccionados
                  </div>
                </div>
              </div>

              {/* User Statistics */}
              {showUserStats && (
                <div className="mb-6 p-4 bg-dark-700/30 rounded-lg border border-dark-600/50">
                  <h4 className="font-semibold mb-3 text-gold-400">Usuarios Registrados Disponibles</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {registeredUsers.map(user => (
                      <div key={user.id} className="flex items-center gap-2 p-2 bg-dark-700/50 rounded-lg">
                        <span className="text-xl">{user.avatar}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{user.username}</div>
                          <div className="text-xs text-dark-300">{user.role} • Lv.{user.level}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {members.map((member, index) => (
                  <div key={member.id} className="card relative">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block font-semibold">
                        Integrante {index + 1}
                      </label>
                      <div className="flex items-center gap-2">
                        {member.selectedUser && (
                          <span className="text-2xl">{member.selectedUser.avatar}</span>
                        )}
                        <button
                          onClick={() => handleUserSearch(index)}
                          className="btn btn-secondary btn-sm"
                          title="Buscar usuario registrado"
                        >
                          <Search size={16} />
                        </button>
                        {member.selectedUser && (
                          <button
                            onClick={() => clearUserSelection(index)}
                            className="btn btn-danger btn-sm"
                            title="Limpiar selección"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                      placeholder={member.selectedUser ? member.selectedUser.username : "Nombre del integrante"}
                      className="input mb-3"
                    />
                    
                    <label className="block font-semibold mb-2">
                      Participación (%)
                    </label>
                    <input
                      type="number"
                      value={member.participation}
                      onChange={(e) => handleMemberChange(index, 'participation', e.target.value)}
                      placeholder="0"
                      className="input"
                      min="0"
                      max="100"
                      step="0.1"
                    />

                    {/* User Search Modal */}
                    {showUserSearch === index && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50">
                        <div className="p-4">
                          <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" size={16} />
                            <input
                              type="text"
                              placeholder="Buscar usuarios por nombre, rol o experiencia..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="input pl-10"
                              autoFocus
                            />
                          </div>
                          
                          <div className="max-h-48 overflow-y-auto space-y-2">
                            {filteredUsers.map(user => (
                              <button
                                key={user.id}
                                onClick={() => selectUser(user, index)}
                                className="w-full p-3 text-left hover:bg-dark-700 rounded-lg flex items-center gap-3 transition-colors"
                              >
                                <span className="text-2xl">{user.avatar}</span>
                                <div className="flex-1">
                                  <div className="font-semibold">{user.username}</div>
                                  <div className="text-sm text-dark-300">
                                    {user.role} • Lv.{user.level} • {user.experience}
                                  </div>
                                </div>
                                <UserPlus size={16} className="text-gold-400" />
                              </button>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-dark-600">
                            <button
                              onClick={() => setShowUserSearch(null)}
                              className="btn btn-secondary w-full"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Summary */}
          <div className="bg-dark-700/30 rounded-xl p-6 border border-dark-600/50 mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={24} className="text-gold-400" />
              Resumen Financiero
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {formatCurrency(financialSummary.total)}
                </div>
                <div className="text-dark-300">Ganancias Totales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {formatCurrency(financialSummary.repair)}
                </div>
                <div className="text-dark-300">Gastos de Reparación</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {formatCurrency(financialSummary.net)}
                </div>
                <div className="text-dark-300">Ganancias Netas</div>
              </div>
            </div>
          </div>

          {/* Results */}
          {showResults && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CalculatorIcon size={24} className="text-gold-400" />
                Resultados del Reparto
              </h3>
              <div className="grid gap-4">
                {results.map((result, index) => (
                  <div key={index} className="card flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{result.name}</div>
                      <div className="text-dark-300">{result.participation}% de participación</div>
                    </div>
                    <div className="text-2xl font-bold text-gradient">
                      {formatCurrency(result.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={calculateDistribution}
              className="btn btn-success flex-1"
              disabled={!totalLoot || parseFloat(totalLoot) <= 0}
            >
              <CalculatorIcon size={20} />
              Calcular Reparto
            </button>
            <button
              onClick={resetCalculator}
              className="btn btn-secondary flex-1"
            >
              <RefreshCw size={20} />
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      {showUserSearch !== null && (
        <UserSearchModal
          isOpen={showUserSearch !== null}
          onClose={() => setShowUserSearch(null)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredUsers={filteredUsers}
          onSelectUser={(user) => selectUser(user, showUserSearch)}
          onClearSelection={() => clearUserSelection(showUserSearch)}
          onViewStats={handleUserStats}
        />
      )}

      {showUserStats && (
        <UserStatsPanel
          user={selectedUserForStats}
          onClose={() => {
            setShowUserStats(false)
            setSelectedUserForStats(null)
          }}
          onEditProfile={handleEditProfile}
        />
      )}

      {showUserProfile && (
        <UserProfile
          user={selectedUserForProfile}
          onClose={() => {
            setShowUserProfile(false)
            setSelectedUserForProfile(null)
          }}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  )
}

export default Calculator 