import { AppState } from ".";
const getPlayerA = (state: AppState) => state.players.playerA;
const getPlayerB = (state: AppState) => state.players.playerB;

export const getPlayerAMoney = (state: AppState) => getPlayerA(state).money;
export const getPlayerBMoney = (state: AppState) => getPlayerB(state).money;
export const getMilitaryPoints = (state: AppState) => state.militaryPoints;
export const getAgeCards = (state: AppState) => state.ageCards;
export const getWonderCards = (state: AppState) => state.wonderCards;
