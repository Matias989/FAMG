import React, { useState } from 'react';
import { Volume2, VolumeX, Settings, X } from 'lucide-react';

const SoundSettings = ({ isVisible, onClose }) => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('soundEnabled') !== 'false';
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notificationsEnabled') !== 'false';
  });

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('soundEnabled', newValue.toString());
  };

  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    localStorage.setItem('notificationsEnabled', newValue.toString());
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Configuración de Sonido</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Sound Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-green-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <h3 className="text-white font-semibold">Sonidos del Sistema</h3>
                  <p className="text-gray-400 text-sm">
                    Sonidos de notificaciones y eventos
                  </p>
                </div>
              </div>
              <button
                onClick={handleSoundToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundEnabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                {notificationsEnabled ? (
                  <Volume2 className="w-5 h-5 text-green-400" />
                ) : (
                  <VolumeX className="w-5 h-5 text-red-400" />
                )}
                <div>
                  <h3 className="text-white font-semibold">Notificaciones de Grupos</h3>
                  <p className="text-gray-400 text-sm">
                    Trompetas cuando se complete un grupo
                  </p>
                </div>
              </div>
              <button
                onClick={handleNotificationsToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">Información</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Los sonidos se reproducen automáticamente</li>
              <li>• Las trompetas suenan cuando un grupo se completa</li>
              <li>• Los sonidos se guardan en tu navegador</li>
              <li>• Puedes desactivar los sonidos en cualquier momento</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoundSettings; 