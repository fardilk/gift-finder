import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PickItem = {
  id: string;
  title: string;
  imageUrl?: string;
  description?: string;
  cost?: string;
  savedAt: number;
};

const STORAGE_KEY = 'my_picks';

function loadInitial(): PickItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PickItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(items: PickItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore persistence errors
  }
}

type PicksState = {
  items: PickItem[];
};

const initialState: PicksState = {
  items: loadInitial(),
};

const picksSlice = createSlice({
  name: 'picks',
  initialState,
  reducers: {
    addPick: (state, action: PayloadAction<Omit<PickItem, 'savedAt'> | PickItem>) => {
      const incoming = action.payload as PickItem;
      const exists = state.items.some((p) => p.id === incoming.id);
      if (!exists) {
        const item: PickItem = { ...incoming, savedAt: incoming.savedAt ?? Date.now() } as PickItem;
        state.items.unshift(item);
        persist(state.items);
      }
    },
    removePick: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
      persist(state.items);
    },
    clearPicks: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addPick, removePick, clearPicks } = picksSlice.actions;
export default picksSlice.reducer;