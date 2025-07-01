// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import toggleReducer from './toggleSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    toggle: toggleReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
