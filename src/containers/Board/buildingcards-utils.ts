import { centerHorizontally, centerRow, getRowOf, getRandomElements, shuffleArray } from "./utils";
import { Position, GameElement, ElementTypes, Age } from "../../types";
import { CARD_WIDTH, CARD_MARGIN, CARD_HEIGHT, MAX_CARDS } from "../../contants";
import { flattenDeep, createElement } from "../../utils";
import {
  buildings_i as buildingsIDb,
  buildings_ii as buildingsIIDb,
  buildings_iii as buildingsIIIDb,
  buildings_g as buildingsGDb
} from '../../data/buildings.json';

export const schemeFirstAge = [ 2, 3, 4, 5, 6 ];
export const schemeSecondAge = [ 6, 5, 4, 3, 2 ];
export const schemeThirdAge = [ 2, 3, 4, 2, 4, 3, 2 ];

const moveRowVertically = (row: Array<Position>, rowIndex: number) =>
  row.map((position) => ({
    ...position,
    y: rowIndex * (CARD_HEIGHT / 3)
  }));

export const getAgeScheme = (age: Age) => {
  switch (age) {
    case "G":
    case "III":
      return schemeThirdAge;
    case "II":
      return schemeSecondAge;
    default:
      return schemeFirstAge;
  }
}

export const getAgeDeck = (age: Age) => {
  switch (age) {
    case "G":
      return buildingsGDb;
    case "III":
      return buildingsIIIDb;
    case "II":
      return buildingsIIDb;
    default:
      return buildingsIDb;
  }
};

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

export const getShuffledCards = (age: Age): Array<GameElement> => {
  const deck = getAgeDeck(age);
  const ageCards = getRandomElements(deck, MAX_CARDS).map((card) => ({
    ...createElement(card, ElementTypes.BUILDING_CARD),
    imageFileBackface: `building-${ age.toLowerCase() }-back.jpg`
  }));
  
  if (age === 'III' || age === 'G') {
    const thirdAgeCards = ageCards.slice(0, MAX_CARDS - 3)

    const guildCards = getRandomElements(buildingsGDb, 3).map((card) => ({
      ...createElement(card, ElementTypes.BUILDING_CARD),
      imageFileBackface: `building-g-back.jpg`
    }));

    return shuffleArray([ ...thirdAgeCards, ...guildCards ])
  }

  return ageCards;
}

export const flipBuildingCards = (cards: Array<GameElement>, age: Age) => 
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
      case 'G':
        return {
          ...card,
          faceDown: (2 <= index && index <= 4) || (9 <= index && index <= 10) || (15 <= index && index <= 17)
        };
      default:
        return card;
    }
  });