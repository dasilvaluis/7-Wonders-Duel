import { centerHorizontally, getRowOf, centerRow, getRandomElements, movePositions, flipCards, injectPositions } from "./board-utils";
import { WONDER_HEIGHT, CARD_MARGIN, WONDER_WIDTH } from "../../contants";
import { Position, GameElement, ElementTypes } from "../../types";
import { flattenDeep } from "../../utils";
import { wonders } from '../../data/wonders.json';
import { v4 as uuidv4 } from 'uuid';

const moveRowVertically = (row: Array<Position>, rowIndex: number) =>
  row.map((position) => ({
    ...position,
    y: rowIndex * (WONDER_HEIGHT + CARD_MARGIN)
  }));

export const getWonderCardsPlacement = (cardWidth: number) => {
  const rows = [4, 4].map((howMany, rowIndex) => {
    const row = getRowOf(howMany, cardWidth);
    const rowMovedVertically = moveRowVertically(row, rowIndex);
    const rowCentered = centerRow(rowMovedVertically, howMany, cardWidth);

    return rowCentered;
  });

  return centerHorizontally(flattenDeep<Position>(rows));
};

export const getShuffledCards = (): Array<GameElement> => 
  getRandomElements(wonders, 8).map((card) => ({
    id: uuidv4(),
    type: ElementTypes.WONDER_CARD,
    x: 0,
    y: 0,
    faceDown: false,
    imageFile: card.file,
    imageFileBackface: 'wonder-back.jpg'
  }));

export const getWonderCards = (): Array<GameElement> => {
  const wonderCards = getShuffledCards();
  const cardsPlacement = getWonderCardsPlacement(WONDER_WIDTH);
  const cardsPlacementShifted = movePositions(cardsPlacement, {
    x: 0, y: CARD_MARGIN * 2
  });
  const cards: Array<GameElement> = flipCards(injectPositions(wonderCards, cardsPlacementShifted));

  return cards;
};
