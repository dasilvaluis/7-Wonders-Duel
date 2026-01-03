import type { SelectElementsActionType } from '../actions/selected-elements-actions';
import { SELECT_ELEMENT, UNSELECT_ELEMENTS } from '../actions/types';

const initialState: Array<string> = [];

export default (state = initialState, action: SelectElementsActionType) => {

  switch (action.type) {
    case SELECT_ELEMENT:
      const filtered = state.filter((el) => el !== action.payload.id)

      return action.payload.selected
        ? [ ...filtered, action.payload.id ]
        : filtered;
    case UNSELECT_ELEMENTS:
      return initialState;
    default: {
      return state;
    }
  }
};
