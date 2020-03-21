import { SET_CARDS, SET_CARD_POSITION } from '../actions/types';
import { CardsActionType } from '../actions/cards-actions';
import { GameElement } from '../types';

const initialState: Array<GameElement> = [];

export default (state = initialState, action: CardsActionType) => {
  switch (action.type) {
    case SET_CARDS:
      return action.payload;
    case SET_CARD_POSITION:
      const _state = [ ...state ];
      const { cardIndex, position: { x, y } } = action.payload;

      _state[cardIndex].x = x;
      _state[cardIndex].y = y;

      return _state;
    default:
      return state;
  }
};
