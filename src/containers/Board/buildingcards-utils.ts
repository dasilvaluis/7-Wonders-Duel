import { centerHorizontally, centerRow, getRowOf, getRandomElements } from "./utils";
import { Position, GameElement, ElementTypes } from "../../types";
import { CARD_WIDTH, CARD_MARGIN, CARD_HEIGHT, MAX_CARDS } from "../../contants";
import { flattenDeep } from "../../utils";
import { cards as cardsDb } from '../../data/cards.json';
import { v4 as uuidv4 } from 'uuid';

export const schemeFirstAge = [ 2, 3, 4, 5, 6 ];
export const schemeSecondAge = [ 6, 5, 4, 3, 2 ];
export const schemeThirdAge = [ 2, 3, 4, 2, 4, 3, 2 ];

const moveRowVertically = (row: Array<Position>, rowIndex: number) =>
  row.map((position) => ({
    ...position,
    y: rowIndex * (CARD_HEIGHT / 3)
  }));

export const getAgeScheme = (age: 'I' | 'II' | 'III') => {
  switch (age) {
    case "III":
      return schemeThirdAge;
    case "II":
      return schemeSecondAge;
    default:
      return schemeFirstAge;
  }
}

export const fixThirdAgeCards = (cards: Array<GameElement>) => {
  const _cards = [ ...cards ];
  _cards[9].x = cards[9].x - (CARD_WIDTH + CARD_MARGIN) / 2;
  _cards[10].x = cards[10].x + (CARD_WIDTH + CARD_MARGIN) / 2;

  return _cards;
}

export const getBuildingCardsPlacement = (scheme: Array<number>, cardWidth: number) => {
  const rows = scheme.map((howMany, rowIndex) => {
    const row = getRowOf(howMany, cardWidth);
    const rowMovedVertically = moveRowVertically(row, rowIndex);
    const rowCentered = centerRow(rowMovedVertically, howMany, cardWidth);

    return rowCentered;
  });

  return centerHorizontally(flattenDeep<Position>(rows));
};

export const getShuffledCards = (): Array<GameElement> => 
  getRandomElements(cardsDb, MAX_CARDS).map((card) => ({
    id: uuidv4(),
    name: card.name,
    type: ElementTypes.BUILDING_CARD,
    x: 0,
    y: 0,
    faceDown: false,
    imageFile: ''
  }));

export const flipBuildingCards = (cards: Array<GameElement>, age: 'I' | 'II' | 'III') => 
  cards.map((card, index) => {
    switch (age) {
      case 'I':
        return {
          ...card,
          faceDown: (2 <= index && index <= 4) || (9 <= index && index <= 13)
        };
      case 'II':
        return {
          ...card,
          faceDown: (6 <= index && index <= 10) || (15 <= index && index <= 17)
        };
      case 'III':
        return {
          ...card,
          faceDown: (2 <= index && index <= 4) || (9 <= index && index <= 10) || (15 <= index && index <= 17)
        };
      default:
        return card;
    }
  });