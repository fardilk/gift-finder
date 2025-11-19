import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

export type Occasion = {
  id: string;
  title: string;
  date?: string; // ISO date string
  recipients: string[]; // emails to invite or acknowledge
  linkedGroupIds: string[]; // connect with existing groups
  inviteLinks: string[]; // shareable codes
  createdAt: number;
};

type OccasionsState = {
  occasions: Occasion[];
};

const STORAGE_KEY = 'occasions_store_v1';

function loadInitial(): OccasionsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { occasions: [] };
    const parsed = JSON.parse(raw) as OccasionsState;
    if (parsed && Array.isArray(parsed.occasions)) return parsed;
  } catch (e) {
    // ignore storage errors
  }
  return { occasions: [] };
}

function persist(state: OccasionsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore storage errors
  }
}

const initialState: OccasionsState = loadInitial();

const occasionsSlice = createSlice({
  name: 'occasions',
  initialState,
  reducers: {
    upsertOccasion: (state, action: PayloadAction<Occasion>) => {
      const idx = state.occasions.findIndex((o) => o.id === action.payload.id);
      if (idx >= 0) state.occasions[idx] = action.payload;
      else state.occasions.unshift(action.payload);
      persist(state);
    },
    createOccasion: {
      prepare: (title: string, date?: string, linkedGroupIds?: string[]) => ({
        payload: { id: nanoid(), title, date, linkedGroupIds: linkedGroupIds ?? [] as string[] },
      }),
      reducer: (
        state,
        action: PayloadAction<{ id: string; title: string; date?: string; linkedGroupIds: string[] }>
      ) => {
        const o: Occasion = {
          id: action.payload.id,
          title: action.payload.title,
          date: action.payload.date,
          recipients: [],
          linkedGroupIds: action.payload.linkedGroupIds,
          inviteLinks: [],
          createdAt: Date.now(),
        };
        state.occasions.unshift(o);
        persist(state);
      },
    },
    addRecipientToOccasion: (
      state,
      action: PayloadAction<{ occasionId: string; email: string }>
    ) => {
      const o = state.occasions.find((x) => x.id === action.payload.occasionId);
      if (o) {
        const email = action.payload.email.trim();
        if (email && !o.recipients.includes(email)) {
          o.recipients.push(email);
          persist(state);
        }
      }
    },
    linkGroupToOccasion: (
      state,
      action: PayloadAction<{ occasionId: string; groupId: string }>
    ) => {
      const o = state.occasions.find((x) => x.id === action.payload.occasionId);
      if (o && !o.linkedGroupIds.includes(action.payload.groupId)) {
        o.linkedGroupIds.push(action.payload.groupId);
        persist(state);
      }
    },
    createOccasionInviteLink: (
      state,
      action: PayloadAction<{ occasionId: string; code?: string }>
    ) => {
      const o = state.occasions.find((x) => x.id === action.payload.occasionId);
      if (o) {
        const code = action.payload.code ?? nanoid(8);
        o.inviteLinks.unshift(code);
        persist(state);
      }
    },
  },
});

export const {
  upsertOccasion,
  createOccasion,
  addRecipientToOccasion,
  linkGroupToOccasion,
  createOccasionInviteLink,
} = occasionsSlice.actions;

export default occasionsSlice.reducer;
