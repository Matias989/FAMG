import React, { useState } from 'react';
import { X, Plus, Trash2, User, Users, Crown, UserPlus } from 'lucide-react';
import UserSearchModal from './UserSearchModal';
import { playNotificationSound } from '../utils/audioUtils';
import { groupsService } from '../services/groupsService';
import { useGroupsStore } from '../store/useGroupsStore';

const ROLES = ['Tanque', 'Sanador', 'DPS', 'Soporte', 'Curador'];

const GroupManager = ({ 
  group, 
  onUpdateGroup, 
  onClose, 
  registeredUsers,
  currentUser,
  onGroupConflict,
  reloadGroups
}) => {
  // Leer el grupo actualizado del store global
  const groupFromStore = useGroupsStore(state => state.getGroupById(group?._id));
  const groupToUse = groupFromStore || group;

  // Determinar si el usuario actual es el creador
  const isCreator = groupToUse.creatorNick && currentUser?.albionNick && groupToUse.creatorNick === currentUser.albionNick;

  const [showUserSearch, setShowUserSearch] = useState(false);
  const [slotToAssign, setSlotToAssign] = useState(null); // index del slot a asignar usuario
  const [roleToAdd, setRoleToAdd] = useState(ROLES[0]);

  // Agregar slot
  const handleAddSlot = () => {
    const newSlots = [...(groupToUse.slots || []), { role: ROLES[0], user: null }];
    onUpdateGroup({ ...groupToUse, slots: newSlots });
  };

  // Quitar slot (si tiene usuario, lo expulsa)
  const handleRemoveSlot = (index) => {
    const newSlots = (groupToUse.slots || []).filter((_, i) => i !== index);
    onUpdateGroup({ ...groupToUse, slots: newSlots });
  };

  // Cambiar rol de slot
  const handleChangeRole = (index, newRole) => {
    const newSlots = [...(groupToUse.slots || [])];
    newSlots[index].role = newRole;
    onUpdateGroup({ ...groupToUse, slots: newSlots });
  };

  // Asignar usuario a slot (para cualquier usuario)
  const handleAssignSelf = async (slotIdx) => {
    try {
      await groupsService.addMemberToGroup(groupToUse._id, { albionNick: currentUser.albionNick, username: currentUser.albionNick });
      if (reloadGroups) reloadGroups();
    } catch (error) {
      const backendMsg = error?.response?.data?.error || error.message;
      if (backendMsg.toLowerCase().includes('ya perteneces a otro grupo')) {
        const existingGroup = error?.response?.data?.existingGroup;
        if (onGroupConflict && existingGroup) onGroupConflict('join', existingGroup, groupToUse);
      } else {
        alert(backendMsg || 'No puedes unirte a este grupo.');
      }
    }
  };

  // Asignar usuario a slot
  const handleAssignUser = (index, user) => {
    const newSlots = [...(groupToUse.slots || [])];
    newSlots[index].user = user;
    onUpdateGroup({ ...groupToUse, slots: newSlots });
    setShowUserSearch(false);
    setSlotToAssign(null);
    playNotificationSound();
  };

  // Expulsar usuario de slot
  const handleKickUser = async (index) => {
    const slot = (groupToUse.slots || [])[index];
    // Si el usuario actual se auto-expulsa
    if (slot.user && currentUser && slot.user.albionNick === currentUser.albionNick && !isCreator) {
      try {
        await groupsService.removeMemberFromGroup(groupToUse._id, currentUser.albionNick);
        if (reloadGroups) reloadGroups();
      } catch (error) {
        alert('Error al salir del grupo');
      }
      return;
    }
    // Expulsión normal (solo para el creador)
    const newSlots = [...(groupToUse.slots || [])];
    newSlots[index].user = null;
    onUpdateGroup({ ...groupToUse, slots: newSlots });
    if (reloadGroups) reloadGroups();
  };

  // El creador puede cambiarse de slot
  const handleMoveCreator = (fromIndex, toIndex) => {
    const newSlots = [...(groupToUse.slots || [])];
    const creatorSlot = newSlots[fromIndex];
    newSlots[fromIndex].user = null;
    newSlots[toIndex].user = currentUser;
    onUpdateGroup({ ...groupToUse, slots: newSlots });
  };

  // Guardar cambios en el grupo (opcional, si quieres un botón de guardar)
  const handleSave = () => {
    onUpdateGroup({ ...groupToUse, slots: groupToUse.slots });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Gestionar Grupo: {group.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Slots Section */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-3">Slots del Grupo</h3>
          <div className="grid gap-3 mb-6">
            {(groupToUse.slots || []).map((slot, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <select
                    value={slot.role}
                    onChange={e => isCreator && handleChangeRole(idx, e.target.value)}
                    className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                    disabled={!isCreator}
                  >
                    {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <span className="text-white font-medium">
                    {slot.user ? (slot.user.username || slot.user.albionNick) : <span className="text-gray-400">Vacío</span>}
                    {slot.user && group.creatorNick && slot.user.albionNick === group.creatorNick && (
                      <span className="ml-2 text-xs text-gold-400">(Creador del grupo)</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Botón para cambiarme de slot: visible para cualquier usuario autenticado en slots vacíos */}
                  {!slot.user && currentUser && (
                    <button
                      onClick={() => handleAssignSelf(idx)}
                      className="p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded transition-colors"
                      title="Cambiarme a este slot"
                    >
                      <User className="w-4 h-4" />
                    </button>
                  )}
                  {/* Botón kick: solo el creador puede expulsar usuarios */}
                  {isCreator && slot.user && (
                    <button
                      onClick={() => handleKickUser(idx)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                      title="Expulsar usuario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {/* Botón auto-expulsar: solo para el usuario actual si no es el creador */}
                  {slot.user && currentUser && slot.user.albionNick === currentUser.albionNick && !isCreator && (
                    <button
                      onClick={() => handleKickUser(idx)}
                      className="p-2 bg-red-500 hover:bg-red-700 text-white rounded transition-colors"
                      title="Salir de este grupo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  {/* Botón eliminar slot: solo el creador puede eliminar slots. Si hay usuario, primero lo expulsa y luego elimina el slot */}
                  {isCreator && (
                    <button
                      onClick={() => {
                        if (slot.user) handleKickUser(idx);
                        handleRemoveSlot(idx);
                      }}
                      className="p-2 bg-red-800 hover:bg-red-900 text-white rounded transition-colors"
                      title={slot.user ? "Expulsar y eliminar slot" : "Eliminar slot"}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {/* Slot especial para agregar slot */}
            {isCreator && (
              <div
                className="flex items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-4 cursor-pointer hover:bg-blue-900/20 transition-colors min-h-[56px]"
                style={{ minHeight: '56px' }}
                onClick={handleAddSlot}
                title="Agregar slot"
              >
                <Plus className="w-8 h-8 text-blue-400" />
              </div>
            )}
          </div>
          {/* Eliminar select y botón de agregar slot y el botón Guardar Cambios */}
        </div>

        {/* User Search Modal para asignar usuario a slot */}
        {showUserSearch && (
          <UserSearchModal
            users={registeredUsers.filter(u => !groupToUse.slots?.some(s => s.user && s.user.id === u.id))}
            searchTerm={''}
            onSearchChange={() => {}}
            onSelectUser={user => handleAssignUser(slotToAssign, user)}
            onClose={() => setShowUserSearch(false)}
            title="Asignar usuario a slot"
          />
        )}
      </div>
    </div>
  );
};

export default GroupManager; 