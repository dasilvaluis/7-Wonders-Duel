import { SET_WONDERS, SET_WONDER_POSITION, FLIP_WONDER } from "./types";
import { Position, GameElement } from "../types";

interface SetWondersAction {
  payload: Array<GameElement>;
  type: typeof SET_WONDERS;
}

interface MoveWonderAction {
  payload: {
    cardIndex: number,
    position: Position
  };
  type: typeof SET_WONDER_POSITION;
}

interface FlipWonderAction {
  payload: {
    cardIndex: number
  };
  type: typeof FLIP_WONDER;
}

export const setWonderCards = (cards: Array<GameElement>): SetWondersAction => ({
  payload: cards,
  type: SET_WONDERS
});

export const setWonderCardPosition = (cardIndex: number, position: Position): MoveWonderAction => ({
  payload: {
    cardIndex,
    position
  },
  type: SET_WONDER_POSITION
});

export const flipWonder = (cardIndex: number): FlipWonderAction => ({
  payload: {
    cardIndex
  },
  type: FLIP_WONDER
});

export type WondersActionType = SetWondersAction | MoveWonderAction | FlipWonderAction;