import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { LogIn, User, Lock, Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const { login } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password) {
      showNotification('Completa todos los campos', 'error')
      return
    }

    setIsLoading(true)

    try {
      // Simular autenticación (en producción usarías Firebase o tu backend)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simular verificación de credenciales
      if (formData.username === 'demo' && formData.password === 'demo') {
        const userData = {
          id: '1',
          username: 'demo',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
          createdAt: new Date().toISOString()
        }
        
        login(userData)
        showNotification('Inicio de sesión exitoso', 'success')
        navigate('/dashboard')
      } else {
        showNotification('Credenciales incorrectas', 'error')
      }
    } catch (error) {
      showNotification('Error al iniciar sesión', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 glow">⚔️</div>
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-dark-300">
            Accede a tu cuenta de Albion Group Manager
          </p>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <User size={16} className="text-gold-400" />
                Nombre de Usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingresa tu nombre de usuario"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Lock size={16} className="text-gold-400" />
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-dark-600 text-gold-500 focus:ring-gold-500 focus:ring-offset-0 bg-dark-700"
                />
                <span className="ml-2 text-sm text-dark-300">Recordarme</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-gold-400 hover:text-gold-300"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Iniciando sesión...
                </div>
              ) : (
                <>
                  <LogIn size={20} />
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-dark-700/30 rounded-lg border border-dark-600/50">
            <h4 className="text-sm font-semibold mb-2 text-gold-400">
              Credenciales de Demo
            </h4>
            <div className="text-xs text-dark-300 space-y-1">
              <div><strong>Usuario:</strong> demo</div>
              <div><strong>Contraseña:</strong> demo</div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-dark-300">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-gold-400 hover:text-gold-300 font-semibold"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 