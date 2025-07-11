import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { groupsService } from '../services/groupsService';

const CreateEvent = ({ onClose, onCreateEvent }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    time: '',
    location: '',
    duration: '',
    maxMembers: 5,
    description: '',
    template: null
  });
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [errorTemplates, setErrorTemplates] = useState(null);

  useEffect(() => {
    setLoadingTemplates(true);
    groupsService.getTemplates()
      .then(data => {
        setTemplates(data);
        setLoadingTemplates(false);
      })
      .catch(() => {
        setErrorTemplates('Error al cargar plantillas');
        setLoadingTemplates(false);
      });
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateSelect = (template) => {
    setFormData(prev => ({
      ...prev,
      template: template
    }));
    setShowTemplateSelector(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.template || !formData.date || !formData.time) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    const newEvent = {
      name: formData.name,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      duration: formData.duration,
      maxMembers: formData.maxMembers,
      description: formData.description,
      template: formData.template
    };
    onCreateEvent(newEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Plus className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Crear Nuevo Evento</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre del Evento</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Ej: Dungeon Martes 8pm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Plantilla</label>
            <button
              type="button"
              className="btn btn-secondary w-full mb-2"
              onClick={() => setShowTemplateSelector(true)}
            >
              {formData.template ? `Plantilla: ${formData.template.name}` : 'Seleccionar Plantilla'}
            </button>
            {showTemplateSelector && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mt-2 max-h-60 overflow-y-auto">
                {loadingTemplates ? (
                  <div className="text-center py-2 text-gray-400">Cargando plantillas...</div>
                ) : errorTemplates ? (
                  <div className="text-center py-2 text-red-400">{errorTemplates}</div>
                ) : (
                  templates.map(template => (
                    <div
                      key={template.id}
                      className="p-2 hover:bg-gray-700 rounded cursor-pointer"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {template.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Fecha</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Hora</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Ubicación</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Ej: Martlock, Dungeon T8"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Duración</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Ej: 2 horas"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Máximo de Miembros</label>
            <input
              type="number"
              value={formData.maxMembers}
              onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value))}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              min="1"
              max="50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows="3"
              placeholder="Describe la actividad, requisitos, etc."
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Crear Evento</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent; 