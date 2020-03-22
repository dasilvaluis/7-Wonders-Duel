import { SET_CARDS, SET_CARD_POSITION, FLIP_CARD } from '../actions/types';
import { BuildingCardsActionType } from '../actions/cards-actions';
import { GameElement } from '../types';

const initialState: Array<GameElement> = [];

export default (state = initialState, action: BuildingCardsActionType) => {
  const _state = [ ...state ];

  switch (action.type) {
    case SET_CARDS:
      return action.payload;
    case SET_CARD_POSITION: {
      const { cardIndex, position: { x, y } } = action.payload;

      _state[cardIndex].x = x;
      _state[cardIndex].y = y;

      return _state;
    }
    case FLIP_CARD: { 
      const { cardIndex } = action.payload;
      _state[cardIndex].faceDown = !_state[cardIndex].faceDown;
      
      return _state;
    }
    default: {
      return state;
    }
  }
};
