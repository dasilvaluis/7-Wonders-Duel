import { combineReducers } from 'redux';
import coin from './coin-reducer';
import militaryPoints from './military-points-reducer';

export default combineReducers({
  coin,
  militaryPoints
});
