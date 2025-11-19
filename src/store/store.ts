import { configureStore } from '@reduxjs/toolkit';
import picksReducer from './picksSlice';
import groupsReducer from './groupsSlice';
import affiliateReducer from './affiliateSlice';
import occasionsReducer from './occasionsSlice';

export const store = configureStore({
  reducer: {
    picks: picksReducer,
    groups: groupsReducer,
    affiliate: affiliateReducer,
    occasions: occasionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
