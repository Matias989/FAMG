import React, { useEffect, useState } from 'react';
import { Users, Bell, Volume2, X } from 'lucide-react';
import { createTrumpetSound } from '../utils/audioUtils';

const GroupCompletionNotification = ({ 
  group, 
  isVisible, 
  onClose, 
  onDismiss 
}) => {
  const [bounce, setBounce] = useState(true);
  useEffect(() => {
    if (isVisible) {
      // Reproducir sonido de trompetas
      const trumpetSound = createTrumpetSound();
      trumpetSound.play();
      setBounce(true);
      setTimeout(() => setBounce(false), 1000); // Rebota solo 1 segundo
    }
  }, [isVisible]);

  if (!isVisible) return null;

  // Adaptar a slots
  const members = group.slots ? group.slots.filter(s => s.user) : [];
  const maxMembers = group.slots ? group.slots.length : 0;

  return (
    <>
      {/* Confetti Animation */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 59, pointerEvents: 'none' }}>
        <Confetti />
      </div>
      {/* Notification Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
        <div className={`bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg shadow-2xl max-w-md w-full animate-fade-in`}>
          <div className="p-6 text-center">
            {/* Icon and Title */}
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="text-4xl">🎉</div>
              <div className="text-4xl">🎺</div>
              <div className="text-4xl">🎉</div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              ¡Grupo Completo!
            </h2>
            
            <div className="bg-white/20 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {group.name}
              </h3>
              <div className="text-white/90 text-sm space-y-1">
                {group.date && !isNaN(new Date(group.date)) && (
                  <div>📅 {new Date(group.date).toLocaleDateString('es-ES')}</div>
                )}
                <div>📍 {group.location}</div>
                <div>👥 {members.length}/{maxMembers} miembros</div>
              </div>
            </div>

            {/* Members Preview */}
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <h4 className="text-white font-semibold mb-2">Miembros del Grupo:</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {members.map((slot, idx) => (
                  <div
                    key={slot.user.id || idx}
                    className="flex items-center space-x-1 bg-white/20 rounded px-2 py-1"
                  >
                    <span className="text-lg">{slot.user.avatar || '👤'}</span>
                    <span className="text-white text-sm font-medium">
                      {slot.user.username || slot.user.albionNick}
                    </span>
                    {group.creatorNick && slot.user.albionNick === group.creatorNick && (
                      <span className="text-yellow-300 text-xs">👑</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>Ver Grupo</span>
              </button>
              <button
                onClick={onDismiss}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupCompletionNotification; 

// Componente simple de confeti SVG animado
function Confetti() {
  return (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      {/* Puedes mejorar esto con una librería real de confeti si lo deseas */}
      <circle cx="20%" cy="10%" r="8" fill="#FFD700">
        <animate attributeName="cy" from="10%" to="90%" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="50%" cy="5%" r="6" fill="#FF69B4">
        <animate attributeName="cy" from="5%" to="95%" dur="1.8s" repeatCount="indefinite" />
      </circle>
      <circle cx="80%" cy="15%" r="7" fill="#00BFFF">
        <animate attributeName="cy" from="15%" to="85%" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="35%" cy="0%" r="5" fill="#32CD32">
        <animate attributeName="cy" from="0%" to="100%" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="65%" cy="20%" r="6" fill="#FF8C00">
        <animate attributeName="cy" from="20%" to="80%" dur="1.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
} 