import { v4 as uuidv4 } from 'uuid';
import { ELEMENT_MARGIN } from '../constants';
import { wonders } from '../data/wonders.json';
import { GameElements, type Coordinates, type GameElement } from '../types';
import {
  centerHorizontally,
  centerRow,
  flattenDeep,
  flipCards,
  getElementSize,
  getRandomElements,
  getRowOfCards,
  injectPositions,
  movePositions,
} from './utils';

const moveRowVertically = (row: Array<Coordinates>, rowIndex: number) =>
  row.map((position) => ({
    ...position,
    y: rowIndex * (getElementSize(GameElements.WONDER_CARD).height + ELEMENT_MARGIN),
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
    type: GameElements.WONDER_CARD,
    x: 0,
    y: 0,
    faceDown: false,
    imageFile: card.file,
    imageFileBackface: 'wonder-back.jpg',
  }));

export const generateWonderCards = (): Array<GameElement> => {
  const wonderWidth = getElementSize(GameElements.WONDER_CARD).width;
  const wonderCards = getShuffledCards();
  const cardsPlacement = getWonderCardsPlacement(wonderWidth);
  const cardsPlacementShifted = movePositions(cardsPlacement, {
    y: ELEMENT_MARGIN + getElementSize(GameElements.BOARD).height,
  });
  const cards: Array<GameElement> = flipCards(injectPositions(wonderCards, cardsPlacementShifted));

  return cards;
};
