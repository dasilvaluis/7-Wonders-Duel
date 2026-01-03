import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './rootState';

export default configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
});
