import { useReducer, useRef, type ComponentRef } from 'react';
import type { Player } from '../../types';
import ScorePadClient from './score-pad-client';
import ScorePadColumn from './score-pad-column';
import './score-pad.scss';

export type PlayerScore = {
  civilization: number;
  science: number;
  commerce: number;
  guild: number;
  wonder: number;
  progress: number;
  money: number;
  military: number;
  suddenDeathMilitary: boolean;
  suddenDeathScience: boolean;
};

export type GameScores = {
  playerA: PlayerScore;
  playerB: PlayerScore;
};

const initialScore: PlayerScore = {
  civilization: 0,
  science: 0,
  commerce: 0,
  guild: 0,
  wonder: 0,
  progress: 0,
  money: 0,
  military: 0,
  suddenDeathMilitary: false,
  suddenDeathScience: false,
};

const initialScores: GameScores = {
  playerA: initialScore,
  playerB: initialScore,
};

const scoresReducer = (state: GameScores, action: any) => {
  switch (action.type) {
    case 'SET_UNITARY_SCORE':
      const { player, value, scoreType } = action.payload;
      const newState = { ...state };
      const playerState = { ...state[player] };

      playerState[scoreType] =
        scoreType === 'suddenDeathMilitary' || scoreType === 'suddenDeathScience' ? !!value : value;

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
  const clientRef = useRef<ComponentRef<typeof ScorePadClient>>(null);
  const [scores, dispatchScoreUpdate] = useReducer(scoresReducer, initialScores);

  const handleInputChange = (player: Player) => (scoreType: string, value: number) => {
    dispatchScoreUpdate({
      type: 'SET_UNITARY_SCORE',
      payload: { player, scoreType, value },
    });

    clientRef.current?.sendScoreUpdate({ player, value, scoreType });
  };

  return (
    <>
      <div className="score-pad">
        <div className="score-pad__column -heading">
          <div className="score-pad__cell score-pad__label -civilization" />
          <div className="score-pad__cell score-pad__label -science" />
          <div className="score-pad__cell score-pad__label -commerce" />
          <div className="score-pad__cell score-pad__label -guild" />
          <div className="score-pad__cell score-pad__label -wonder" />
          <div className="score-pad__cell score-pad__label -progress" />
          <div className="score-pad__cell score-pad__label -money" />
          <div className="score-pad__cell score-pad__label -military" />
          <div className="score-pad__cell score-pad__label -total" />
          <div className="score-pad__cell score-pad__label -suddenDeathMilitary" />
          <div className="score-pad__cell score-pad__label -suddenDeathScience" />
        </div>
        <ScorePadColumn score={scores.playerA} onUpdate={handleInputChange('playerA')} />
        <ScorePadColumn score={scores.playerB} onUpdate={handleInputChange('playerB')} />
      </div>
      <ScorePadClient
        ref={clientRef}
        scores={scores}
        onUpdateScore={(data) => {
          dispatchScoreUpdate({ type: 'SET_UNITARY_SCORE', payload: data });
        }}
        onSetScore={(data) => {
          dispatchScoreUpdate({ type: 'SET_SCORES', payload: data });
        }}
      />
    </>
  );
};
