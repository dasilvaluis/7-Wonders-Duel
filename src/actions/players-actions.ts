import { ADD_MONEY, TAKE_MONEY, SET_MONEY } from "./types";

interface AddMoneyAction {
  player: string;
  type: typeof ADD_MONEY;
}

interface TakeMoneyAction {
  player: string;
  type: typeof TAKE_MONEY;
}

interface SetMoneyAction {
  player: string;
  payload: number;
  type: typeof SET_MONEY;
}

export const addMoney = (player: 'playerA' | 'playerB'): AddMoneyAction => ({
  player,
  type: ADD_MONEY
});

export const takeMoney = (player: 'playerA' | 'playerB'): TakeMoneyAction => ({
  player,
  type: TAKE_MONEY
});

export const setMoney = (player: 'playerA' | 'playerB', ammount: number): SetMoneyAction => ({
  player,
  payload: ammount,
  type: SET_MONEY
});

export type PlayersActionType = AddMoneyAction | TakeMoneyAction | SetMoneyAction;