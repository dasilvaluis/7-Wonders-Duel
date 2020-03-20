import { ADD_MONEY, TAKE_MONEY, SET_MONEY } from '../actions/types';
import { PlayersActionType } from '../actions/players-actions';

interface Player {
  money: number
}

export interface Players {
  playerA: Player,
  playerB: Player
}

const initialState: Players = {
  playerA: {
    money: 0
  },
  playerB: {
    money: 0
  }
};

export default (state = initialState, action: PlayersActionType) => {
  const _state = { ...state };

  switch (action.type) {
    case ADD_MONEY:
      _state[action.player].money = _state[action.player].money + 1;

      return _state;
    case TAKE_MONEY:
      if (_state[action.player].money > 0) {
        _state[action.player].money = _state[action.player].money - 1;  
      }

      return _state;
    case SET_MONEY:
      if (action.payload >= 0) {
        _state[action.player].money = action.payload; 
      }

      return _state;
    default:
      return state;
  }
};
