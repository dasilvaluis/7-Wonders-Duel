import {
  centerHorizontally,
  getRowOf,
  centerRow,
  getRandomElements,
  movePositions,
  flipCards,
  injectPositions,
  getElementSize
} from "../../utils";
import { ELEMENT_MARGIN } from "../../contants";
import { Coordinates, GameElement, ElementTypes } from "../../types";
import { flattenDeep } from "../../utils";
import { wonders } from '../../data/wonders.json';
import { v4 as uuidv4 } from 'uuid';

const moveRowVertically = (row: Array<Coordinates>, rowIndex: number) =>
  row.map((position) => ({
    ...position,
    y: rowIndex * (getElementSize(ElementTypes.WONDER_CARD).height + ELEMENT_MARGIN)
  }));

export const getWonderCardsPlacement = (cardWidth: number) => {
  const rows = [4, 4].map((howMany, rowIndex) => {
    const row = getRowOf(howMany, cardWidth);
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

export const getWonderCards = (): Array<GameElement> => {
  const wonderWidth = getElementSize(ElementTypes.WONDER_CARD).width;
  const wonderCards = getShuffledCards();
  const cardsPlacement = getWonderCardsPlacement(wonderWidth);
  const cardsPlacementShifted = movePositions(cardsPlacement, {
    x: 0, 
    y: ELEMENT_MARGIN * 2.5 + getElementSize(ElementTypes.BOARD).height
  });
  const cards: Array<GameElement> = flipCards(injectPositions(wonderCards, cardsPlacementShifted));

  return cards;
};
