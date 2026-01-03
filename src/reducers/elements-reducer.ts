import type { ElementsActionType } from '../actions/elements-actions';
import {
  ADD_ELEMENTS,
  BRING_ELEMENT,
  FLIP_ELEMENT,
  MOVE_ELEMENT,
  SET_ELEMENTS,
  SET_ELEMENT_POSITION,
} from '../actions/types';
import type { ElementsMap } from '../types';
import { keyBy, moveElementBackward, reverse } from '../utils/utils';

const initialState: ElementsMap = {};

export default (state = initialState, action: ElementsActionType) => {
  const _state = { ...state };

  switch (action.type) {
    case SET_ELEMENTS:
      return keyBy(action.payload, 'id');
    case ADD_ELEMENTS:
      return { ...state, ...keyBy(action.payload, 'id') };
    case SET_ELEMENT_POSITION: {
      const { id, position } = action.payload;

      if (typeof _state[id] !== 'undefined') {
        _state[id].x = position.x;
        _state[id].y = position.y;
      }

      return _state;
    }
    case MOVE_ELEMENT: {
      const { id, delta } = action.payload;

      if (typeof _state[id] !== 'undefined') {
        _state[id].x += delta.x;
        _state[id].y += delta.y;
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
        let shiftedState = [...stateValues];

        switch (direction) {
          case 'forward':
          case 'backward': {
            const shiftedTypeElements =
              direction === 'forward'
                ? reverse(moveElementBackward(reverse(sameTypeElements), (el) => el.id === id))
                : moveElementBackward(sameTypeElements, (el) => el.id === id);

            shiftedState = [...differentTypeElements, ...shiftedTypeElements];
            break;
          }
          case 'front':
          case 'back': {
            const differentIdElements = sameTypeElements.filter((el) => el.id !== id);

            const shiftedTypeElements =
              direction === 'front'
                ? [...differentIdElements, _state[id]]
                : [_state[id], ...differentIdElements];

            shiftedState = [...differentTypeElements, ...shiftedTypeElements];
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
