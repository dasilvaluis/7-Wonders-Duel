import { combineReducers } from 'redux';
import elements from './elements-reducer';
import selectedElements from './selected-elements-reducer';

export const rootReducer = combineReducers({
  elements,
  selectedElements,
});

export type AppState = ReturnType<typeof rootReducer>;
