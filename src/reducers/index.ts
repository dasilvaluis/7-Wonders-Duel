import { combineReducers } from 'redux';
import players, { Players } from './players-reducer';
import militaryPoints from './military-points-reducer';
import buildingCards from './cards-reducer';
import wonderCards from './wonders-reducer';
import { GameElement } from '../types';

export interface AppState {
  players: Players;
  buildingCards: Array<GameElement>;
  wonderCards: Array<GameElement>;
  militaryPoints: number;
}

export default combineReducers<AppState>({
  players,
  buildingCards,
  wonderCards,
  militaryPoints
});
