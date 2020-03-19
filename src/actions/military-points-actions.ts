import { SET_MILITARY_POINTS } from "./types";

interface SetMilitaryPoints {
  type: typeof SET_MILITARY_POINTS;
  payload: number;
}

export type MilitaryPointsActionType = SetMilitaryPoints;
