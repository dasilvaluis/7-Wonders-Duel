import { SET_CARDS, MOVE_CARD } from "./types";
import { AgeCard } from "../reducers/cards-reducer";

interface SetCardsAction {
  payload: Array<AgeCard>;
  type: typeof SET_CARDS;
}

interface MoveCardAction {
  payload: AgeCard;
  type: typeof MOVE_CARD;
}

export const setCards = (cards: Array<AgeCard>): SetCardsAction => ({
  payload: cards,
  type: SET_CARDS
});

export const moveCard = (card: AgeCard): MoveCardAction => ({
  payload: card,
  type: MOVE_CARD
});


export type CardsActionType = SetCardsAction | MoveCardAction;