import { combineReducers } from 'redux';
import type { ElementsMap } from '../types';
import elements from './elements-reducer';
import selectedElements from './selected-elements-reducer';

export type AppState = {
  elements: ElementsMap;
  selectedElements: Array<string>;
};

export default combineReducers<AppState>({
  elements,
  selectedElements,
});
