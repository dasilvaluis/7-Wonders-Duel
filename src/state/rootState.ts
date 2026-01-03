import { combineReducers } from 'redux';
import elements from './elementsSlice';
import selectedElements from './selectedElementsSlice';

export const rootReducer = combineReducers({
  elements,
  selectedElements,
});

export type AppState = ReturnType<typeof rootReducer>;
