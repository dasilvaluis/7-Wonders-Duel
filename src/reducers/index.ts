import { combineReducers } from 'redux';
import players, { Players } from './players-reducer';
import militaryPoints from './military-points-reducer';
import ageCards, { AgeCard } from './cards-reducer';

export interface AppState {
  players: Players;
  ageCards: Array<AgeCard>;
  militaryPoints: number;
}

export default combineReducers<AppState>({
  players,
  ageCards,
  militaryPoints
});
