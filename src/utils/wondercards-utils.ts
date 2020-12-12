import {
  centerHorizontally,
  getRowOfCards,
  centerRow,
  getRandomElements,
  movePositions,
  flipCards,
  injectPositions,
  getElementSize,
  flattenDeep
} from './utils';
import { ELEMENT_MARGIN } from '../contants';
import { Coordinates, GameElement, ElementTypes } from '../types';
import { wonders } from '../data/wonders.json';
import { v4 as uuidv4 } from 'uuid';

const moveRowVertically = (row: Array<Coordinates>, rowIndex: number) =>
  row.map((position) => ({
    ...position,
    y: rowIndex * (getElementSize(ElementTypes.WONDER_CARD).height + ELEMENT_MARGIN)
  }));

export const getWonderCardsPlacement = (cardWidth: number) => {
  const rows = [4, 4].map((howMany, rowIndex) => {
    const row = getRowOfCards(howMany, cardWidth);
    const rowMovedVertically = moveRowVertically(row, rowIndex);
    const rowCentered = centerRow(rowMovedVertically, howMany, cardWidth);

    return rowCentered;
  });

  return centerHorizontally(flattenDeep<Coordinates>(rows));
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

export const generateWonderCards = (): Array<GameElement> => {
  const wonderWidth = getElementSize(ElementTypes.WONDER_CARD).width;
  const wonderCards = getShuffledCards();
  const cardsPlacement = getWonderCardsPlacement(wonderWidth);
  const cardsPlacementShifted = movePositions(cardsPlacement, {
    y: ELEMENT_MARGIN + getElementSize(ElementTypes.BOARD).height
  });
  const cards: Array<GameElement> = flipCards(injectPositions(wonderCards, cardsPlacementShifted));

  return cards;
};
