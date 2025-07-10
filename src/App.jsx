import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import Groups from './pages/Groups/Groups'
import Events from './pages/Events/Events'
import Calculator from './pages/Calculator/Calculator'
import Templates from './pages/Templates/Templates'
import Profile from './pages/Profile/Profile'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 glow">⚔️</div>
          <h2 className="text-2xl font-bold text-gradient">Verificando autenticación...</h2>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

// Componente para rutas de admin
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 glow">⚔️</div>
          <h2 className="text-2xl font-bold text-gradient">Verificando autenticación...</h2>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!user.isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Componente principal de la aplicación
const AppContent = () => {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-albion-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 glow">⚔️</div>
          <h1 className="text-2xl font-bold text-gradient">Albion Group Manager</h1>
          <p className="text-dark-300 mt-2">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar página de auth
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth onAuthSuccess={() => window.location.href = '/dashboard'} />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    );
  }

  // Si hay usuario autenticado, mostrar aplicación principal
  return (
    <Router>
      <div className="min-h-screen bg-albion-bg">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/events" element={<Events />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/templates" element={
              <AdminRoute>
                <Templates />
              </AdminRoute>
            } />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App; 