import { SET_MILITARY_POINTS } from '../actions/types';
import { MilitaryPointsActionType } from '../actions/military-points-actions';

const initialState = 0;

export default (state = initialState, action: MilitaryPointsActionType) => {
  switch (action.type) {
    case SET_MILITARY_POINTS:
      return action.payload;
    default:
      return state;
  }
};
