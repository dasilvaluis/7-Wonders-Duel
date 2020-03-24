import { centerHorizontally, getRowOf, centerRow, getRandomElements } from "./utils";
import { WONDER_HEIGHT, CARD_MARGIN } from "../../contants";
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
    name: card.name,
    type: ElementTypes.WONDER_CARD,
    x: 0,
    y: 0,
    faceDown: false,
  }));