import { AppState } from './reducers';
import { ElementTypes } from '../types';

const getPlayerA = (state: AppState) => state.players.playerA;
const getPlayerB = (state: AppState) => state.players.playerB;

export const getPlayerAMoney = (state: AppState) => getPlayerA(state).money;
export const getPlayerBMoney = (state: AppState) => getPlayerB(state).money;

export const getElements = (state: AppState, type?: ElementTypes) =>
  type ? Object.values(state.elements).filter((el) => el.type === type) : Object.values(state.elements);

export const getElement = (state: AppState, id: string) =>
  Object.values(state.elements).filter((el) => el.id === id);
