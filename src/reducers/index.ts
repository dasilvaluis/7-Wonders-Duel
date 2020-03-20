import { combineReducers } from 'redux';
import money from './money-reducer';
import militaryPoints from './military-points-reducer';

export interface AppState {
  money: number
  militaryPoints: number
}

export default combineReducers<AppState>({
  money,
  militaryPoints
});
