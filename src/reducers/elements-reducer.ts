import { SET_ELEMENTS, SET_ELEMENT_POSITION, ADD_ELEMENTS, FLIP_ELEMENT } from '../actions/types';
import { ElementsActionType } from '../actions/elements-actions';
import { ElementsMap } from '../types';
import { keyBy } from '../utils';

const initialState: ElementsMap = {};

export default (state = initialState, action: ElementsActionType) => {
  const _state = { ...state };

  switch (action.type) {
    case SET_ELEMENTS:
      return keyBy(action.payload, 'id');
    case ADD_ELEMENTS:
      return { ...state, ...keyBy(action.payload, 'id') };
    case SET_ELEMENT_POSITION: {
      const { id, position: { x, y } } = action.payload;

      if (typeof _state[id] !== 'undefined') {
        _state[id].x = x;
        _state[id].y = y; 
      }

      return _state;
    }
    case FLIP_ELEMENT: { 
      const { id } = action.payload;

      if (typeof _state[id] !== 'undefined') {
        _state[id].faceDown = !_state[id].faceDown;
      }
      
      return _state;
    }
    default: {
      return state;
    }
  }
};
