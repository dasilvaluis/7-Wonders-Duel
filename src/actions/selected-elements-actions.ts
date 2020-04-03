import { SELECT_ELEMENT, UNSELECT_ELEMENTS } from "./types";

interface SelectElementAction {
  payload: {
    id: string;
    selected: boolean;
  };
  type: typeof SELECT_ELEMENT;
}

interface UnselectElementsAction {
  type: typeof UNSELECT_ELEMENTS;
}

export const selectElement = (elementId: string, selected: boolean): SelectElementAction => ({
  payload: {
    selected,
    id: elementId
  },
  type: SELECT_ELEMENT
});

export const unselectElements = (): UnselectElementsAction => ({
  type: UNSELECT_ELEMENTS
});

export type SelectElementsActionType = SelectElementAction | UnselectElementsAction;
