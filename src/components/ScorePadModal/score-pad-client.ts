import { useEffect, forwardRef, useImperativeHandle } from 'react';
import socket from '../../wsClient';
import { SET_SCORE, GET_SCORES, SET_SCORES } from '../../contants';
import { SetScoreAPIEvent } from '../../types';
import { GameScores } from './score-pad';


interface Props {
  ref: any;
  scores: GameScores;
  onUpdateScore(data: SetScoreAPIEvent): void;
  onSetScore(data: GameScores): void;
}

export default forwardRef(({
  scores,
  onUpdateScore,
  onSetScore
}: Props, ref) => {
  useEffect(() => {
    socket.emit(GET_SCORES)

    socket.on(SET_SCORE, (data: SetScoreAPIEvent) => {
      onUpdateScore(data);
    });

    socket.on(SET_SCORES, (data: GameScores) => {
      onSetScore(data);
    });

    return () => {
      socket.off(SET_SCORES).off(SET_SCORE)
    }
  }, []);

  useEffect(() => {
    socket
      .off(GET_SCORES)
      .on(GET_SCORES, () => {
        socket.emit(SET_SCORES, scores);
      });

    return () => {
      socket.off(GET_SCORES)
    }
  }, [ scores ]);

  useImperativeHandle(ref, () => ({
    sendScoreUpdate: (apiEvent: SetScoreAPIEvent) => {
      socket.emit(SET_SCORE, apiEvent)
    }
  }));

  return null;
});
