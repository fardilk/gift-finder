import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

export type AffiliateEntry = {
  id: string;
  marketplace: string;
  code: string;
  createdAt: number;
};

type AffiliateState = {
  affiliates: AffiliateEntry[];
  masterMarketplaces: string[];
};

const STORAGE_KEY = 'affiliate_store_v1';

function loadInitial(): AffiliateState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AffiliateState;
  } catch {
    // ignore storage errors
  }
  return {
    affiliates: [],
    masterMarketplaces: ['Shopee', 'Lazada', 'Tokopedia', 'Bukalapak', 'Blibli'],
  };
}

function persist(state: AffiliateState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

const initialState: AffiliateState = loadInitial();

const affiliateSlice = createSlice({
  name: 'affiliate',
  initialState,
  reducers: {
    addAffiliate: {
      prepare: (marketplace: string, code: string) => ({ payload: { id: nanoid(), marketplace, code } }),
      reducer: (state, action: PayloadAction<{ id: string; marketplace: string; code: string }>) => {
        state.affiliates.unshift({ ...action.payload, createdAt: Date.now() });
        persist(state);
      },
    },
    updateAffiliate: (state, action: PayloadAction<{ id: string; marketplace?: string; code?: string }>) => {
      const idx = state.affiliates.findIndex((a) => a.id === action.payload.id);
      if (idx >= 0) {
        state.affiliates[idx] = { ...state.affiliates[idx], ...action.payload } as AffiliateEntry;
        persist(state);
      }
    },
    removeAffiliate: (state, action: PayloadAction<{ id: string }>) => {
      state.affiliates = state.affiliates.filter((a) => a.id !== action.payload.id);
      persist(state);
    },
    addMarketplace: (state, action: PayloadAction<string>) => {
      const name = action.payload.trim();
      if (name && !state.masterMarketplaces.includes(name)) {
        state.masterMarketplaces.push(name);
        state.masterMarketplaces.sort((a, b) => a.localeCompare(b));
        persist(state);
      }
    },
    removeMarketplace: (state, action: PayloadAction<string>) => {
      state.masterMarketplaces = state.masterMarketplaces.filter((m) => m !== action.payload);
      persist(state);
    },
  },
});

export const { addAffiliate, updateAffiliate, removeAffiliate, addMarketplace, removeMarketplace } = affiliateSlice.actions;
export default affiliateSlice.reducer;
