import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNotification } from '../../contexts/NotificationContext'
import { UserPlus, User, Lock, Mail, Eye, EyeOff } from 'lucide-react'

const Register = () => {
  const { login } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      showNotification('Completa todos los campos', 'error')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      showNotification('Las contraseñas no coinciden', 'error')
      return false
    }

    if (formData.password.length < 6) {
      showNotification('La contraseña debe tener al menos 6 caracteres', 'error')
      return false
    }

    if (!formData.email.includes('@')) {
      showNotification('Ingresa un email válido', 'error')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Simular registro (en producción usarías Firebase o tu backend)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simular creación de usuario
      const userData = {
        id: Date.now().toString(),
        username: formData.username,
        email: formData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.username}`,
        createdAt: new Date().toISOString()
      }
      
      login(userData)
      showNotification('Cuenta creada exitosamente', 'success')
      navigate('/dashboard')
    } catch (error) {
      showNotification('Error al crear la cuenta', 'error')
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
            Crear Cuenta
          </h2>
          <p className="text-dark-300">
            Únete a Albion Group Manager
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
                placeholder="Elige un nombre de usuario"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Mail size={16} className="text-gold-400" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
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
                  placeholder="Crea una contraseña"
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

            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Lock size={16} className="text-gold-400" />
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu contraseña"
                  className="input pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-dark-600 text-gold-500 focus:ring-gold-500 focus:ring-offset-0 bg-dark-700"
                required
              />
              <span className="ml-2 text-sm text-dark-300">
                Acepto los{' '}
                <Link to="/terms" className="text-gold-400 hover:text-gold-300">
                  términos y condiciones
                </Link>
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creando cuenta...
                </div>
              ) : (
                <>
                  <UserPlus size={20} />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-dark-300">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="text-gold-400 hover:text-gold-300 font-semibold"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register 