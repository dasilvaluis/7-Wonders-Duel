import { ADD_COIN, TAKE_COIN } from "./types";

interface AddCoinAction {
  type: typeof ADD_COIN;
}

interface TakeCoinAction {
  type: typeof TAKE_COIN;
}

export type CoinActionType = AddCoinAction | TakeCoinAction;