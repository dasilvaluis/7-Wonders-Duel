import { SET_CARDS, SET_CARD_POSITION } from "./types";
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

export const setAgeCards = (cards: Array<GameElement>): SetCardsAction => ({
  payload: cards,
  type: SET_CARDS
});

export const setAgeCardPosition = (cardIndex: number, position: Position): MoveCardAction => ({
  payload: {
    cardIndex,
    position
  },
  type: SET_CARD_POSITION
});


export type CardsActionType = SetCardsAction | MoveCardAction;