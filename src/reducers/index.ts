import { combineReducers } from 'redux';
import players, { Players } from './players-reducer';
import militaryPoints from './military-points-reducer';
import ageCards from './cards-reducer';
import wonderCards from './wonders-reducer';
import { GameElement } from '../types';

export interface AppState {
  players: Players;
  ageCards: Array<GameElement>;
  wonderCards: Array<GameElement>;
  militaryPoints: number;
}

export default combineReducers<AppState>({
  players,
  ageCards,
  wonderCards,
  militaryPoints
});
