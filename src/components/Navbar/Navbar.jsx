import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { groupsService } from '../../services/groupsService'
import { 
  Home, 
  Users, 
  Calendar, 
  Calculator, 
  Settings, 
  LogIn, 
  LogOut, 
  User,
  Menu,
  X,
  Shield,
  Crown,
  Eye,
  Search
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { showNotification } = useNotification()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [groups, setGroups] = useState([])
  const [availableGroups, setAvailableGroups] = useState([])
  // Eliminar el botón de buscar actividad y el modal asociado
  // 1. Quitar el botón <button ... onClick={() => setShowJoinModal(true)} ...> ... </button> en el bloque de usuario
  // 2. Quitar el botón similar en el menú móvil
  // 3. Quitar el modal {showJoinModal && (...)} y los estados relacionados
  // 4. Quitar los estados y funciones relacionados: showJoinModal, selectedActivity, selectedRole, activityTypes, roleTypes, findGroupsByActivityAndRole, handleAutoJoin

  const handleLogout = () => {
    logout()
    showNotification('Sesión cerrada exitosamente', 'success')
    navigate('/auth')
  }

  // Cargar grupos para verificar disponibilidad
  useEffect(() => {
    if (user) {
      loadGroups()
    }
  }, [user])

  const loadGroups = async () => {
    try {
      const groupsData = await groupsService.getGroups()
      setGroups(groupsData)
      
      // Buscar grupos disponibles para el usuario
      const userRole = user?.role || 'Tanque'
      const available = groupsData.filter(group => {
        if (group.status !== 'Activo') return false
        
        const availableSlots = group.slots && group.slots.filter(slot => 
          !slot.user && slot.role === userRole
        )
        
        return availableSlots && availableSlots.length > 0
      })
      
      setAvailableGroups(available)
    } catch (error) {
      console.error('Error loading groups:', error)
    }
  }

  // Verificar si el usuario está en algún grupo activo
  const userInActiveGroup = groups.some(group =>
    group.status === 'Activo' &&
    group.slots && group.slots.some(slot => slot.user && slot.user.albionNick === user?.albionNick)
  )

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/groups', label: 'Grupos', icon: Users },
    // { path: '/events', label: 'Eventos', icon: Calendar }, // Oculto temporalmente
    { path: '/calculator', label: 'Calculadora', icon: Calculator },
    // Plantillas solo para admin
    ...(user?.isAdmin ? [{ path: '/templates', label: 'Plantillas', icon: Settings }] : [])
  ];

  const isActive = (path) => location.pathname === path

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.albionNick || user.username || 'Usuario';
  };

  const getUserPrimaryRole = () => {
    if (!user || !user.roles || user.roles.length === 0) return null;
    const primaryRole = user.roles.find(role => role.isPrimary);
    return primaryRole || user.roles[0];
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="text-2xl glow">⚔️</div>
              <span className="text-xl font-bold text-gradient">Albion Group Manager</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* User Menu / Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  
                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    <Link to="/profile" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                      <div className="text-2xl">⚔️</div>
                      <div className="text-right">
                        <div className="font-semibold text-white">{getUserDisplayName()}</div>
                        {getUserPrimaryRole() && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            {getUserPrimaryRole().type} - Nivel {user.level}
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="btn btn-danger"
                  >
                    <LogOut size={20} />
                    Salir
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth" className="btn btn-primary">
                    <LogIn size={20} />
                    Iniciar Sesión
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-dark-300 hover:text-white hover:bg-dark-700/50"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-dark-800/50 rounded-lg mt-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-link block ${isActive(item.path) ? 'active' : ''}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  )
                })}
                
                {/* Mobile Auth */}
                {user ? (
                  <div className="pt-4 border-t border-dark-600">
                    <Link to="/profile" className="flex items-center space-x-3 p-3 bg-dark-700/30 rounded-lg mb-3 hover:bg-dark-700/50 transition-colors">
                      <div className="text-2xl">⚔️</div>
                      <div>
                        <div className="font-semibold text-white">{getUserDisplayName()}</div>
                        {getUserPrimaryRole() && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            {getUserPrimaryRole().type} - Nivel {user.level}
                          </div>
                        )}
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="btn btn-danger w-full"
                    >
                      <LogOut size={20} />
                      Salir
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-dark-600">
                    <Link
                      to="/auth"
                      className="btn btn-primary w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogIn size={20} />
                      Iniciar Sesión
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modal de búsqueda de grupo */}
      
    </>
  )
}

export default Navbar 