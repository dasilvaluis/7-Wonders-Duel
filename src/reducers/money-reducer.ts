import { ADD_MONEY, TAKE_MONEY } from '../actions/types';
import { MoneyActionType } from '../actions/money-actions';

const initialState = 0;

export default (state = initialState, action: MoneyActionType) => {
  switch (action.type) {
    case ADD_MONEY:
      return state++;
    case TAKE_MONEY:
      return state--;
    default:
      return state;
  }
};
