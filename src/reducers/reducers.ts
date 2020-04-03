import { combineReducers } from 'redux';
import { ElementsMap } from '../types';
import elements from './elements-reducer';
import selectedElements from './selected-elements-reducer';

export interface AppState {
  elements: ElementsMap;
  selectedElements: Array<string>;
}

export default combineReducers<AppState>({
  elements,
  selectedElements
});
