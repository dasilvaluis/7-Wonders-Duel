import { SET_CARDS, SET_CARD_POSITION } from "./types";
import { AgeCard } from "../reducers/cards-reducer";
import { Position } from "../types";

interface SetCardsAction {
  payload: Array<AgeCard>;
  type: typeof SET_CARDS;
}

interface MoveCardAction {
  payload: {
    cardIndex: number,
    position: Position
  };
  type: typeof SET_CARD_POSITION;
}

export const setAgeCards = (cards: Array<AgeCard>): SetCardsAction => ({
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