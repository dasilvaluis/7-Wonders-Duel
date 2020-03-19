import { ADD_COIN, TAKE_COIN } from '../actions/types';
import { CoinActionType } from '../actions/coin-actions';

const initialState = 0;

export default (state = initialState, action: CoinActionType) => {
  switch (action.type) {
    case ADD_COIN:
      return state++;
    case TAKE_COIN:
      return state--;
    default:
      return state;
  }
};
