import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { WEBSOCKET_EVENTS } from '../../constants';
import { elementsActions } from '../../reducers/elements-reducer';
import { getElements } from '../../reducers/selectors';
import type { Age, Coordinates, Direction, GameElement } from '../../types';
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
  bringElement: (elementId: string, direction: Direction) => void;
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
  const gameElements = useSelector(pickElements);

  const [age, setAge] = useState<Age | null>(null);

  useEffect(() => {
    const stopListening = socketListeners({
      onYouStart: startGame,
      onSetElements: (elements) => {
        dispatch(elementsActions.setElements(elements));
      },
      onMoveElement: (id, delta) => {
        dispatch(elementsActions.moveElement({ id, delta }));
      },
      onAddElements: (data) => {
        dispatch(elementsActions.addElements(data));
      },
      onFlipElement: (id) => {
        dispatch(elementsActions.flipElement({ id }));
      },
      onBringElement: (id, direction) => {
        dispatch(elementsActions.bringElement({ id, direction }));
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

  const startGame = () => {
    const initialElements = [
      ...getProgressTokens(),
      ...getMilitaryTokens(),
      ...generateCoins(),
      ...generateWonderCards(),
      generateConflictPawn(),
    ];

    emitSetElements(initialElements);
    dispatch(elementsActions.setElements(initialElements));
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
      startGame,
      flipElement: emitFlipElement,
      bringElement: emitBringElement,
      moveElement: emitMoveElement,
      addElements: emitAddElements,
    }),
    [age, setAge, startGame],
  );

  return <WebSocketContext.Provider value={providerValue}>{children}</WebSocketContext.Provider>;
};
