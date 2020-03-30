import { SET_ELEMENTS, SET_ELEMENT_POSITION, ADD_ELEMENTS, FLIP_ELEMENT, BRING_ELEMENT } from '../actions/types';
import { ElementsActionType } from '../actions/elements-actions';
import { ElementsMap } from '../types';
import { keyBy, reverse, moveElementBackward } from '../utils';

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
    case BRING_ELEMENT: {
      const { id, direction } = action.payload;

      if (typeof _state[id] !== 'undefined') {
        const stateValues = Object.values(_state);
        const sameTypeElements = stateValues.filter((el) => el.type === _state[id].type);
        const differentTypeElements = stateValues.filter((el) => el.type !== _state[id].type);
        let shiftedState = [ ...stateValues ];

        switch (direction) {
          case 'forward':
          case 'backward': {
            const shiftedTypeElements = direction === 'forward' 
              ? reverse(moveElementBackward(reverse(sameTypeElements), (el) => el.id === id))
              : moveElementBackward(sameTypeElements, (el) => el.id === id);

            shiftedState = [
              ...differentTypeElements,
              ...shiftedTypeElements
            ];
            break;
          }
          case 'front':
          case 'back': {
            const differentIdElements = sameTypeElements.filter((el) => el.id !== id);

            const shiftedTypeElements = direction === 'front' 
              ? [ ...differentIdElements, _state[id] ]
              : [ _state[id], ...differentIdElements ];

            shiftedState = [
              ...differentTypeElements,
              ...shiftedTypeElements
            ];
            break;
          }
          default:
            break;
        }
        
        return keyBy(shiftedState, 'id');
      }

      return _state;
    }
    default: {
      return state;
    }
  }
};
