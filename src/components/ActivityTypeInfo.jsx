import React from 'react';
import { Users, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const ActivityTypeInfo = () => {
  return (
    <div className="card mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Tipos de Actividades</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Grupos Abiertos */}
        <div className="border border-blue-500/30 rounded-lg p-6 bg-blue-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-bold text-blue-400">Grupos Abiertos</h3>
          </div>
          
          <p className="text-gray-300 mb-4">
            Actividades continuas donde los miembros pueden unirse en cualquier momento.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Sin fecha específica</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Unión inmediata</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Plantillas disponibles</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Gestión de roles</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Ideal para:</strong> Dungeons diarios, grupos de gathering, 
              actividades PvP espontáneas, entrenamientos regulares.
            </p>
          </div>
        </div>

        {/* Eventos Programados */}
        <div className="border border-purple-500/30 rounded-lg p-6 bg-purple-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-purple-400" />
            <h3 className="text-xl font-bold text-purple-400">Eventos Programados</h3>
          </div>
          
          <p className="text-gray-300 mb-4">
            <strong>Grupos con fecha y hora específica</strong> donde los miembros confirman asistencia.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Fecha y hora específica</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Confirmación de asistencia</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Plantillas disponibles</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Requisitos específicos</span>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-purple-500/20 rounded-lg">
            <p className="text-sm text-purple-300">
              <strong>Ideal para:</strong> GvG, ZvZ, HCE programadas, 
              eventos especiales, raids organizadas, torneos.
            </p>
          </div>
        </div>
      </div>

      {/* Comparación */}
      <div className="mt-8 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
        <h4 className="text-lg font-semibold mb-4 text-center">Arquitectura del Sistema</h4>
        
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-blue-400 mb-2">Grupos</div>
            <div className="space-y-1 text-gray-300">
              <div>• Actividad base</div>
              <div>• Sin fecha límite</div>
              <div>• Unión inmediata</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="font-semibold text-purple-400 mb-2">Eventos</div>
            <div className="space-y-1 text-gray-300">
              <div>• Grupo + Calendario</div>
              <div>• Fecha específica</div>
              <div>• Confirmación requerida</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="font-semibold text-gold-400 mb-2">Compartido</div>
            <div className="space-y-1 text-gray-300">
              <div>• Plantillas</div>
              <div>• Gestión de miembros</div>
              <div>• Calculadora de loot</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-gray-600">
          <p className="text-center text-sm text-gray-300">
            <strong>Concepto clave:</strong> Un evento es un grupo programado en el calendario. 
            Ambos comparten la misma base de funcionalidad pero los eventos agregan la dimensión temporal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityTypeInfo; 