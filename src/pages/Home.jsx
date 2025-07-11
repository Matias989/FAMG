import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Users, 
  Calendar, 
  Calculator, 
  Settings, 
  Shield, 
  Heart, 
  Sword, 
  ArrowRight,
  Star
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { groupsService } from '../services/groupsService'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: Users,
      title: 'Gestión de Grupos',
      description: 'Crea y gestiona grupos de juego con roles específicos para cada actividad.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Calendar,
      title: 'Eventos Organizados',
      description: 'Programa eventos y actividades con plantillas predefinidas para diferentes tipos de contenido.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Calculator,
      title: 'Calculadora de Loot',
      description: 'Reparte ganancias equitativamente considerando participación y gastos de reparación.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Settings,
      title: 'Plantillas Personalizadas',
      description: 'Crea plantillas de grupos para diferentes tipos de contenido: PvE, PvP, HCE, etc.',
      color: 'from-purple-500 to-purple-600'
    }
  ]

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-8xl mb-6 glow">⚔️</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Albion Group Manager</span>
          </h1>
          <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto">
            La plataforma definitiva para organizar grupos, eventos y gestionar el loot en Albion Online. 
            Conecta con jugadores, crea eventos y reparte ganancias de manera justa.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-primary text-lg px-8 py-4">
                  Ir al Dashboard
                  <ArrowRight size={24} />
                </Link>
                <Link to="/groups" className="btn btn-secondary text-lg px-8 py-4">
                  Ver Grupos
                  <Users size={24} />
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                  Comenzar Gratis
                  <ArrowRight size={24} />
                </Link>
                <Link to="/login" className="btn btn-secondary text-lg px-8 py-4">
                  Iniciar Sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Características Principales
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="card text-center group hover:scale-105">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                    <Icon size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-dark-300">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Plantillas de Grupos
          </h2>
          {loadingTemplates ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚔️</div>
              <h3 className="text-2xl font-bold mb-2">Cargando plantillas...</h3>
            </div>
          ) : errorTemplates ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-2xl font-bold mb-2">{errorTemplates}</h3>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-8">
                {templates.slice(0, 3).map((template, index) => (
                  <div key={index} className="card group hover:scale-105">
                    <div className="text-4xl mb-4">{template.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{template.name}</h3>
                    <p className="text-dark-300 mb-4">{template.category}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.roles && template.roles.map((role, roleIndex) => (
                        <span
                          key={roleIndex}
                          className="px-3 py-1 bg-dark-700/50 rounded-full text-sm text-dark-300"
                        >
                          {role.name || role}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link to="/templates" className="btn btn-primary">
                  Ver Todas las Plantillas
                  <ArrowRight size={20} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="card">
              <div className="text-4xl font-bold text-gradient mb-2">1000+</div>
              <p className="text-dark-300">Grupos Creados</p>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-gradient mb-2">5000+</div>
              <p className="text-dark-300">Eventos Organizados</p>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-gradient mb-2">10000+</div>
              <p className="text-dark-300">Jugadores Activos</p>
            </div>
            <div className="card">
              <div className="text-4xl font-bold text-gradient mb-2">50000+</div>
              <p className="text-dark-300">Cálculos de Loot</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para Organizar tu Grupo?
          </h2>
          <p className="text-xl text-dark-300 mb-8">
            Únete a miles de jugadores que ya están usando Albion Group Manager 
            para organizar sus actividades de manera eficiente.
          </p>
          
          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary text-lg px-8 py-4">
                Registrarse Gratis
                <Star size={24} />
              </Link>
              <Link to="/login" className="btn btn-secondary text-lg px-8 py-4">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home 