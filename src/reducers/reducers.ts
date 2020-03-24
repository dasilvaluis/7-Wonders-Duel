import { combineReducers } from 'redux';
import players, { Players } from './players-reducer';
import militaryPoints from './military-points-reducer';
import { ElementsMap } from '../types';
import elements from './elements-reducer';

export interface AppState {
  players: Players;
  elements: ElementsMap;
  militaryPoints: number;
}

export default combineReducers<AppState>({
  players,
  elements,
  militaryPoints
});
