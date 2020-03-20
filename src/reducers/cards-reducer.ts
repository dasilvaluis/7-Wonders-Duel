import { SET_CARDS } from '../actions/types';
import { CardsActionType } from '../actions/cards-actions';
import { Position } from '../types';

export interface AgeCard extends Position {
  name: string,
  type: string,
  cost?: { 
    [key: string ]: number
  },
  effect?: {
    [key: string ]: number | string
  }
}

const initialState: Array<AgeCard> = [];

export default (state = initialState, action: CardsActionType) => {
  switch (action.type) {
    case SET_CARDS:
      return action.payload;
    default:
      return state;
  }
};
