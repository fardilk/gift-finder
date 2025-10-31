import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import type { PickItem } from './picksSlice';

export type Group = {
  id: string;
  name: string;
  members: string[]; // emails
  picks: PickItem[];
  inviteLinks: string[]; // codes
  createdAt: number;
};

type GroupsState = {
  groups: Group[];
};

const STORAGE_KEY = 'groups_store';

function loadInitial(): GroupsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { groups: [] };
    const parsed = JSON.parse(raw) as GroupsState;
    if (parsed && Array.isArray(parsed.groups)) return parsed;
  } catch (e) {
    // ignore storage errors
  }
  return { groups: [] };
}

function persist(state: GroupsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore storage errors
  }
}

const initialState: GroupsState = loadInitial();

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addOrReplaceGroup: (state, action: PayloadAction<Group>) => {
      const idx = state.groups.findIndex((g) => g.id === action.payload.id);
      if (idx >= 0) state.groups[idx] = action.payload;
      else state.groups.unshift(action.payload);
      persist(state);
    },
    createGroup: {
      prepare: (name: string) => ({ payload: { id: nanoid(), name } }),
      reducer: (state, action: PayloadAction<{ id: string; name: string }>) => {
        const g: Group = {
          id: action.payload.id,
          name: action.payload.name,
          members: [],
          picks: [],
          inviteLinks: [],
          createdAt: Date.now(),
        };
        state.groups.unshift(g);
        persist(state);
      },
    },
    addMember: (state, action: PayloadAction<{ groupId: string; email: string }>) => {
      const g = state.groups.find((x) => x.id === action.payload.groupId);
      if (g && !g.members.includes(action.payload.email)) {
        g.members.push(action.payload.email);
        persist(state);
      }
    },
    addPickToGroup: (state, action: PayloadAction<{ groupId: string; pick: PickItem }>) => {
      const g = state.groups.find((x) => x.id === action.payload.groupId);
      if (g && !g.picks.some((p) => p.id === action.payload.pick.id)) {
        g.picks.unshift(action.payload.pick);
        persist(state);
      }
    },
    removePickFromGroup: (state, action: PayloadAction<{ groupId: string; pickId: string }>) => {
      const g = state.groups.find((x) => x.id === action.payload.groupId);
      if (g) {
        g.picks = g.picks.filter((p) => p.id !== action.payload.pickId);
        persist(state);
      }
    },
    createInviteLink: (state, action: PayloadAction<{ groupId: string; code?: string }>) => {
      const g = state.groups.find((x) => x.id === action.payload.groupId);
      if (g) {
        const code = action.payload.code ?? nanoid(8);
        g.inviteLinks.unshift(code);
        persist(state);
      }
    },
  },
});

export const { addOrReplaceGroup, createGroup, addMember, addPickToGroup, removePickFromGroup, createInviteLink } = groupsSlice.actions;
export default groupsSlice.reducer;
