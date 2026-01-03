import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { WEBSOCKET_EVENTS } from '../../constants';
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
    socket.emit(WEBSOCKET_EVENTS.GET_SCORES);

    socket.on(WEBSOCKET_EVENTS.SET_SCORE, (data: SetScoreAPIEvent) => {
      onUpdateScore(data);
    });

    socket.on(WEBSOCKET_EVENTS.SET_SCORES, (data: GameScores) => {
      onSetScore(data);
    });

    return () => {
      socket.off(WEBSOCKET_EVENTS.SET_SCORES).off(WEBSOCKET_EVENTS.SET_SCORE);
    };
  }, []);

  useEffect(() => {
    socket.off(WEBSOCKET_EVENTS.GET_SCORES).on(WEBSOCKET_EVENTS.GET_SCORES, () => {
      socket.emit(WEBSOCKET_EVENTS.SET_SCORES, scores);
    });

    return () => {
      socket.off(WEBSOCKET_EVENTS.GET_SCORES);
    };
  }, [scores]);

  useImperativeHandle(ref, () => ({
    sendScoreUpdate: (apiEvent: SetScoreAPIEvent) => {
      socket.emit(WEBSOCKET_EVENTS.SET_SCORE, apiEvent);
    },
  }));

  return null;
});
