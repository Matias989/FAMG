import { createContext, useContext, useState } from 'react'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de un NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification = {
      id,
      message,
      type,
      duration
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const value = {
    notifications,
    showNotification,
    removeNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  )
}

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg shadow-lg max-w-sm animate-slide-in ${
            notification.type === 'success' ? 'bg-green-600' :
            notification.type === 'error' ? 'bg-red-600' :
            notification.type === 'warning' ? 'bg-yellow-600' :
            'bg-albion-600'
          } text-white flex items-center gap-3`}
        >
          <span className="text-lg">
            {notification.type === 'success' ? '✅' :
             notification.type === 'error' ? '❌' :
             notification.type === 'warning' ? '⚠️' :
             'ℹ️'}
          </span>
          <span className="flex-1">{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
} 