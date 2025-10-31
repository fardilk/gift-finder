import { configureStore } from '@reduxjs/toolkit';
import picksReducer from './picksSlice';
import groupsReducer from './groupsSlice';
import affiliateReducer from './affiliateSlice';

export const store = configureStore({
  reducer: {
    picks: picksReducer,
    groups: groupsReducer,
    affiliate: affiliateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
