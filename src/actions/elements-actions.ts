import { SET_ELEMENTS, SET_ELEMENT_POSITION, ADD_ELEMENTS, FLIP_ELEMENT, BRING_ELEMENT, MOVE_ELEMENT } from "./types";
import { Coordinates, GameElement } from "../types";

interface SetElementsAction {
  payload: Array<GameElement>;
  type: typeof SET_ELEMENTS;
}

interface AddElementsAction {
  payload: Array<GameElement>;
  type: typeof ADD_ELEMENTS;
}

interface SetElementPositionAction {
  payload: {
    id: string,
    position: Coordinates
  };
  type: typeof SET_ELEMENT_POSITION;
}

interface MoveElementAction {
  payload: {
    id: string,
    delta: Coordinates
  };
  type: typeof MOVE_ELEMENT;
}

interface FlipElementAction {
  payload: {
    id: string
  };
  type: typeof FLIP_ELEMENT;
}

interface BringElementAction {
  payload: {
    id: string,
    direction: string
  };
  type: typeof BRING_ELEMENT;
}

export const setElements = (elements: Array<GameElement>): SetElementsAction => ({
  payload: elements,
  type: SET_ELEMENTS
});

export const addElements = (elements: Array<GameElement>): AddElementsAction => ({
  payload: elements,
  type: ADD_ELEMENTS
});

export const setElementPosition = (elementId: string, position: Coordinates): SetElementPositionAction => ({
  payload: {
    position,
    id: elementId
  },
  type: SET_ELEMENT_POSITION
});

export const moveElement = (elementId: string, delta: Coordinates): MoveElementAction => ({
  payload: {
    id: elementId,
    delta
  },
  type: MOVE_ELEMENT
});

export const flipElement = (elementId: string): FlipElementAction => ({
  payload: {
    id: elementId
  },
  type: FLIP_ELEMENT
});

export const bringElement = (elementId: string, direction: string): BringElementAction => ({
  payload: {
    direction,
    id: elementId
  },
  type: BRING_ELEMENT
});

export type ElementsActionType = SetElementsAction |
  AddElementsAction |
  MoveElementAction |
  SetElementPositionAction |
  FlipElementAction |
  BringElementAction;
