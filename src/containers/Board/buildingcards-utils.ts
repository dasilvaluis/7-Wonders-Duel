import { flattenMultiLevelArray, centerHorizontally, centerRow, getRowOf } from "./utils";
import { Position, GameElement } from "../../types";
import { CARD_WIDTH, CARD_MARGIN, CARD_HEIGHT } from "../../contants";

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

  return centerHorizontally(flattenMultiLevelArray<Position>(rows));
};

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