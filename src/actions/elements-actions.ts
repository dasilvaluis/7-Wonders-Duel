import { SET_ELEMENTS, SET_ELEMENT_POSITION, ADD_ELEMENTS, FLIP_ELEMENT } from "./types";
import { Position, GameElement } from "../types";

interface SetElementsAction {
  payload: Array<GameElement>;
  type: typeof SET_ELEMENTS;
}

interface AddElementsAction {
  payload: Array<GameElement>;
  type: typeof ADD_ELEMENTS;
}

interface MoveElementAction {
  payload: {
    id: string,
    position: Position
  };
  type: typeof SET_ELEMENT_POSITION;
}

interface FlipElementAction {
  payload: {
    id: string
  };
  type: typeof FLIP_ELEMENT;
}

export const setElements = (elements: Array<GameElement>): SetElementsAction => ({
  payload: elements,
  type: SET_ELEMENTS
});

export const addElements = (elements: Array<GameElement>): AddElementsAction => ({
  payload: elements,
  type: ADD_ELEMENTS
});

export const setElementPosition = (elementId: string, position: Position): MoveElementAction => ({
  payload: {
    id: elementId,
    position
  },
  type: SET_ELEMENT_POSITION
});

export const flipElement = (elementId: string): FlipElementAction => ({
  payload: {
    id: elementId
  },
  type: FLIP_ELEMENT
});

export type ElementsActionType = SetElementsAction | AddElementsAction | MoveElementAction | FlipElementAction;
