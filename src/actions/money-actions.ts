import { ADD_MONEY, TAKE_MONEY } from "./types";

interface AddMoneyAction {
  type: typeof ADD_MONEY;
}

interface TakeMoneyAction {
  type: typeof TAKE_MONEY;
}

export type MoneyActionType = AddMoneyAction | TakeMoneyAction;