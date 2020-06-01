import React, { useReducer, useEffect } from 'react';
import ScorePadColumn from './ScorePadColumn';
import socket from '../../wsClient';
import './ScorePad.scss';
import { SET_SCORE, GET_SCORES, SET_SCORES } from '../../contants';
import { Player, SetScoreAPIEvent } from '../../types';

export interface PlayerScore {
  civilisation: number;
  science: number;
  commerce: number;
  guild: number;
  wonder: number;
  progress: number;
  money: number;
  military: number;
  suddendeathMilitary: boolean;
  suddendeathScience: boolean;
}

interface GameScores {
  playerA: PlayerScore,
  playerB: PlayerScore,
}

const initalScore: PlayerScore = {
  civilisation: 0,
  science: 0,
  commerce: 0,
  guild: 0,
  wonder: 0,
  progress: 0,
  money: 0,
  military: 0,
  suddendeathMilitary: false,
  suddendeathScience: false
};

const initalScores: GameScores = {
  playerA: initalScore,
  playerB: initalScore,
};

const sendScoreUpdate = (apiEvent: SetScoreAPIEvent) => {
  socket.emit(SET_SCORE, apiEvent)
}

const scoresReducer = (state: GameScores, action) => {
  switch (action.type) {
    case 'single_score':
      const { player, value, scoreType } = action.payload;
      const newState = { ...state };
      const playerState = { ...state[player] };

      playerState[scoreType] =
        scoreType === 'suddendeathMilitary' || scoreType === 'suddendeathScience'
          ? !!value
          : value

      newState[player] = playerState;

      return newState;
    case 'all_scores':
      return action.payload;
    default:
      break;
  }
  const newState = { ...state };
  const playerState = { ...state[action.player] };

  playerState[action.scoreType] = action.value;
  newState[action.player] = playerState;

  return newState;
};

export default () => {
  const [ scores, dispatchScoreUpdate ] = useReducer(scoresReducer, initalScores);

  useEffect(() => {
    socket.emit(GET_SCORES)

    socket.on(SET_SCORE, (data: SetScoreAPIEvent) => {
      dispatchScoreUpdate({ type: 'single_score', payload: data });
    });

    socket.on(SET_SCORES, (data: GameScores) => {
      dispatchScoreUpdate({ type: 'all_scores', payload: data });
    });

    return () => {
      socket.off(SET_SCORES).off(SET_SCORE)
    }
  }, []);

  useEffect(() => {
    socket
      .off(GET_SCORES)
      .on(GET_SCORES, () => {
        console.log(scores);
        
        socket.emit(SET_SCORES, scores);
      });

    return () => {
      socket.off(GET_SCORES)
    }
  }, [ scores ]);

  const handleInputChange = (player: Player) => (scoreType: string, value: number) => {
    dispatchScoreUpdate({
      type: 'single_score',
      payload: { player, scoreType, value }
    });
    sendScoreUpdate({ player, value, scoreType })
  };

  return (
    <div className="score-pad">
      <div className="score-pad__column -heading">
        <div className="score-pad__cell score-pad__label -civilisation" />
        <div className="score-pad__cell score-pad__label -science" />
        <div className="score-pad__cell score-pad__label -commerce" />
        <div className="score-pad__cell score-pad__label -guild" />
        <div className="score-pad__cell score-pad__label -wonder" />
        <div className="score-pad__cell score-pad__label -progress" />
        <div className="score-pad__cell score-pad__label -money" />
        <div className="score-pad__cell score-pad__label -military" />
        <div className="score-pad__cell score-pad__label -total" />
        <div className="score-pad__cell score-pad__label -suddendeathMilitary" />
        <div className="score-pad__cell score-pad__label -suddendeathScience" />
      </div>
      <ScorePadColumn score={scores.playerA} onUpdate={handleInputChange('playerA')} />
      <ScorePadColumn score={scores.playerB} onUpdate={handleInputChange('playerB')} />
    </div>
  )
};
