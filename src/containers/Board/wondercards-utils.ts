import { centerHorizontally, getRowOf, centerVertically, centerRow } from "./utils";
import { WONDER_WIDTH, WONDER_HEIGHT } from "../../contants";

export const getWonderCardsPlacement = () => {
  const row = getRowOf(4, WONDER_WIDTH);
  const rowCentered = centerRow(row, 4, WONDER_WIDTH);
  return centerHorizontally(centerVertically(rowCentered, WONDER_HEIGHT));
};