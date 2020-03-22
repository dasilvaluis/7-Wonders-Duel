import { SET_WONDERS, SET_WONDER_POSITION, FLIP_WONDER } from '../actions/types';
import { WondersActionType } from '../actions/wonders-actions';
import { GameElement } from '../types';

const initialState: Array<GameElement> = [];

export default (state = initialState, action: WondersActionType) => {
  const _state = [ ...state ];
  
  switch (action.type) {
    case SET_WONDERS:
      return action.payload;
    case SET_WONDER_POSITION: {
      const { cardIndex, position: { x, y } } = action.payload;

      _state[cardIndex].x = x;
      _state[cardIndex].y = y;

      return _state;
    }
    case FLIP_WONDER: { 
      const { cardIndex } = action.payload;
      _state[cardIndex].faceDown = !_state[cardIndex].faceDown;
      
      return _state;
    }
    default:
      return state;
  }
};
