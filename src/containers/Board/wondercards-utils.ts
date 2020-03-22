import { centerHorizontally, getRowOf, centerRow, flattenMultiLevelArray } from "./utils";
import { WONDER_HEIGHT, CARD_MARGIN } from "../../contants";
import { Position } from "../../types";

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

  return centerHorizontally(flattenMultiLevelArray<Position>(rows));
};
