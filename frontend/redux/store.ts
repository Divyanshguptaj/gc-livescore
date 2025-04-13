// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import exampleReducer from './exampleSlice';
import signupReducer from './signupSlice';
import userSlice from './userSlice';
export const store = configureStore({
  reducer: {
    example: exampleReducer,
    signup: signupReducer,
    user: userSlice,
  },
});

// Infer types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
