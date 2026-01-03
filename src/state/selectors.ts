import { GameElements, type ElementsMap, type GameElementTypes } from '../types';
import type { AppState } from './rootState';

export const pickElements = (state: AppState) => Object.values(state.elements);

export const pickElementOfType = (state: AppState, type: GameElementTypes) =>
  Object.values(state.elements).filter((el) => el.type === type);

export const pickSelectedElements = (state: AppState) =>
  state.selectedElements.reduce((selectedElements, id) => {
    if (typeof state.elements[id] !== 'undefined') {
      selectedElements[id] = state.elements[id];
    }

    return selectedElements;
  }, {} as ElementsMap);

export const selectMilitaryTokens = (state: AppState) => [
  ...pickElementOfType(state, GameElements.MILITARY_TOKEN_5),
  ...pickElementOfType(state, GameElements.MILITARY_TOKEN_2),
];

export const selectCoins = (state: AppState) => [
  ...pickElementOfType(state, GameElements.COIN_6),
  ...pickElementOfType(state, GameElements.COIN_3),
  ...pickElementOfType(state, GameElements.COIN_1),
];

export const selectWonderCards = (state: AppState) => pickElementOfType(state, GameElements.WONDER_CARD);

export const selectBuildingCards = (state: AppState) => pickElementOfType(state, GameElements.BUILDING_CARD);

export const selectProgressTokens = (state: AppState) =>
  pickElementOfType(state, GameElements.PROGRESS_TOKEN);

export const selectConflictPawn = (state: AppState) =>
  pickElementOfType(state, GameElements.CONFLICT_PAWN)[0];
