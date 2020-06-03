import React, { useReducer, useRef } from 'react';
import ScorePadColumn from './ScorePadColumn';
import { Player } from '../../types';
import ScorePadClient from './ScorePadClient';
import './ScorePad.scss';

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

export interface GameScores {
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

const scoresReducer = (state: GameScores, action) => {
  switch (action.type) {
    case 'SET_UNITARY_SCORE':
      const { player, value, scoreType } = action.payload;
      const newState = { ...state };
      const playerState = { ...state[player] };

      playerState[scoreType] =
        scoreType === 'suddendeathMilitary' || scoreType === 'suddendeathScience'
          ? !!value
          : value

      newState[player] = playerState;

      return newState;
    case 'SET_SCORES':
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
  const clientRef = useRef(null);
  const [ scores, dispatchScoreUpdate ] = useReducer(scoresReducer, initalScores);

  const handleInputChange = (player: Player) => (scoreType: string, value: number) => {
    dispatchScoreUpdate({
      type: 'SET_UNITARY_SCORE',
      payload: { player, scoreType, value }
    });

    clientRef.current && clientRef.current.sendScoreUpdate({ player, value, scoreType });
  };

  return (
    <>
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
      <ScorePadClient
        ref={clientRef}
        scores={scores}
        onUpdateScore={(data) => { dispatchScoreUpdate({ type: 'SET_UNITARY_SCORE', payload: data }); }}
        onSetScore={(data) => { dispatchScoreUpdate({ type: 'SET_SCORES', payload: data }); }}
      />
    </>
  )
};

