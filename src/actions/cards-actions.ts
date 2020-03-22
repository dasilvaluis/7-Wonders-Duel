import { SET_CARDS, SET_CARD_POSITION, FLIP_CARD } from "./types";
import { Position, GameElement } from "../types";

interface SetCardsAction {
  payload: Array<GameElement>;
  type: typeof SET_CARDS;
}

interface MoveCardAction {
  payload: {
    cardIndex: number,
    position: Position
  };
  type: typeof SET_CARD_POSITION;
}

interface FlipCardAction {
  payload: {
    cardIndex: number
  };
  type: typeof FLIP_CARD;
}

export const setBuildingCards = (cards: Array<GameElement>): SetCardsAction => ({
  payload: cards,
  type: SET_CARDS
});

export const setBuildingCardPosition = (cardIndex: number, position: Position): MoveCardAction => ({
  payload: {
    cardIndex,
    position
  },
  type: SET_CARD_POSITION
});

export const flipCard = (cardIndex: number): FlipCardAction => ({
  payload: {
    cardIndex
  },
  type: FLIP_CARD
});

export type BuildingCardsActionType = SetCardsAction | MoveCardAction | FlipCardAction;
