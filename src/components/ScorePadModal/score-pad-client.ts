import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { GET_SCORES, SET_SCORE, SET_SCORES } from '../../constants';
import { type SetScoreAPIEvent } from '../../types';
import socket from '../../wsClient';
import { type GameScores } from './score-pad';

type Props = {
  ref: any;
  scores: GameScores;
  onUpdateScore(data: SetScoreAPIEvent): void;
  onSetScore(data: GameScores): void;
};

type RefHandle = {
  sendScoreUpdate(apiEvent: SetScoreAPIEvent): void;
};

export default forwardRef<RefHandle, Props>(({ scores, onUpdateScore, onSetScore }, ref) => {
  useEffect(() => {
    socket.emit(GET_SCORES);

    socket.on(SET_SCORE, (data: SetScoreAPIEvent) => {
      onUpdateScore(data);
    });

    socket.on(SET_SCORES, (data: GameScores) => {
      onSetScore(data);
    });

    return () => {
      socket.off(SET_SCORES).off(SET_SCORE);
    };
  }, []);

  useEffect(() => {
    socket.off(GET_SCORES).on(GET_SCORES, () => {
      socket.emit(SET_SCORES, scores);
    });

    return () => {
      socket.off(GET_SCORES);
    };
  }, [scores]);

  useImperativeHandle(ref, () => ({
    sendScoreUpdate: (apiEvent: SetScoreAPIEvent) => {
      socket.emit(SET_SCORE, apiEvent);
    },
  }));

  return null;
});
