import { create } from 'zustand';

export const useGroupsStore = create((set, get) => ({
  groups: [],
  loading: false,
  lastUpdate: null,
  setGroups: (groups) => {
    const validGroups = Array.isArray(groups)
      ? groups.filter(g => g && g._id && Array.isArray(g.slots))
      : [];
    console.log('[Zustand] setGroups:', validGroups);
    set({ groups: validGroups });
  },
  updateGroup: (group) => set(state => {
    if (!group || !group._id || !Array.isArray(group.slots)) return {};
    const exists = Array.isArray(state.groups) && state.groups.some(g => g._id === group._id);
    const newGroups = exists
      ? state.groups.map(g => g._id === group._id ? { ...group } : g)
      : [...state.groups, group];
    console.log('[Zustand] updateGroup:', group, 'Nuevo array:', newGroups);
    return { groups: newGroups };
  }),
  removeGroup: (groupId) => set(state => ({
    groups: Array.isArray(state.groups) ? state.groups.filter(g => g._id !== groupId) : []
  })),
  getGroupById: (id) => {
    const groups = get().groups;
    return Array.isArray(groups) ? groups.find(g => g._id === id) || null : null;
  },
  loadGroups: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/groups`);
      const groups = await response.json();
      set({ 
        groups: Array.isArray(groups) ? groups : [], 
        loading: false, 
        lastUpdate: new Date().toISOString() 
      });
    } catch (error) {
      console.error('Error loading groups:', error);
      set({ loading: false });
    }
  },
})); 