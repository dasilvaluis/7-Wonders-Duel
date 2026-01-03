import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addElements,
  bringElement,
  flipElement,
  moveElement,
  setElements,
} from '../../actions/elements-actions';
import { WEBSOCKET_EVENTS } from '../../constants';
import { getElements } from '../../reducers/selectors';
import type { Age, Coordinates, GameElement } from '../../types';
import { generateConflictPawn, getMilitaryTokens, getProgressTokens } from '../../utils/board';
import { generateCoins } from '../../utils/coins';
import { generateWonderCards } from '../../utils/wonderCards';
import socket from '../../wsClient';
import {
  emitAddElements,
  emitBringElement,
  emitFlipElement,
  emitMoveElement,
  emitSetAge,
  emitSetElements,
  emitSetState,
} from './emitter';
import { socketListeners } from './listeners';

type Props = {
  children: React.ReactNode;
};

type ContextValue = {
  age: Age | null;
  changeAge: (age: Age | null) => void;
  startGame: () => void;
  flipElement: (elementId: string) => void;
  bringElement: (elementId: string, direction: 'front' | 'back') => void;
  moveElement: (elementsIds: Array<string>, delta: Coordinates) => void;
  addElements: (elements: Array<GameElement>) => void;
};

export const WebSocketContext = createContext<ContextValue | null>(null);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }

  return context;
};

export const WebSocketProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const gameElements = useSelector(getElements);

  const [age, setAge] = useState<Age | null>(null);

  useEffect(() => {
    const stopListening = socketListeners({
      onYouStart: () => {
        emitStartGame();
      },
      onSetElements: (elements) => {
        dispatch(setElements(elements));
      },
      onMoveElement: (id, delta) => {
        dispatch(moveElement(id, delta));
      },
      onAddElements: (data) => {
        dispatch(addElements(data));
      },
      onFlipElement: (elementId) => {
        dispatch(flipElement(elementId));
      },
      onBringElement: (elementId, direction) => {
        dispatch(bringElement(elementId, direction));
      },
      onSetAge: setAge,
    });

    return stopListening;
  }, []);

  useEffect(() => {
    socket.off(WEBSOCKET_EVENTS.GET_STATE).on(WEBSOCKET_EVENTS.GET_STATE, () => {
      emitSetState(gameElements, age);
    });
  }, [gameElements, age]);

  const emitStartGame = () => {
    const initialElements = [
      ...getProgressTokens(),
      ...getMilitaryTokens(),
      ...generateCoins(),
      ...generateWonderCards(),
      generateConflictPawn(),
    ];

    emitSetElements(initialElements);
    dispatch(setElements(initialElements));
    setAge(null);
    emitSetAge(null);
  };

  const providerValue: ContextValue = useMemo(
    () => ({
      age,
      changeAge: (age: Age | null) => {
        setAge(age);
        emitSetAge(age);
      },
      startGame: emitStartGame,
      flipElement: emitFlipElement,
      bringElement: emitBringElement,
      moveElement: emitMoveElement,
      addElements: emitAddElements,
    }),
    [age, setAge, emitStartGame],
  );

  return <WebSocketContext.Provider value={providerValue}>{children}</WebSocketContext.Provider>;
};
