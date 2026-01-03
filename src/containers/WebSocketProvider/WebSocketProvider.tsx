import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import {
  addElements,
  bringElement,
  flipElement,
  moveElement,
  setElements,
} from '../../actions/elements-actions';
import {
  ADD_ELEMENTS,
  BRING_ELEMENT,
  FLIP_ELEMENT,
  GET_STATE,
  MOVE_ELEMENT,
  SET_AGE,
  SET_ELEMENTS,
  SET_STATE,
  YOU_START,
} from '../../constants';
import type { AppState } from '../../reducers/reducers';
import { getElements } from '../../reducers/selectors';
import type {
  AddElementsAPIEvent,
  Age,
  BringElementAPIEvent,
  Coordinates,
  FlipElementAPIEvent,
  GameElement,
  MoveElementAPIEvent,
  SetAgeAPIEvent,
  SetElementsAPIEvent,
  SetStateAPIEvent,
} from '../../types';
import { generateConflictPawn, getMilitaryTokens, getProgressTokens } from '../../utils/board';
import { generateCoins } from '../../utils/coins';
import { generateWonderCards } from '../../utils/wonderCards';
import socket from '../../wsClient';

type StateProps = {
  gameElements: Array<GameElement>;
};

type DispatchProps = {
  onSetElements(elements: Array<GameElement>): void;
  onAddElements(elements: Array<GameElement>): void;
  onMoveElement(elementId: string, position: Coordinates): void;
  onFlipElement(elementId: string): void;
  onBringElement(elementId: string, direction: string): void;
};

type Props = StateProps &
  DispatchProps & {
    children: React.ReactNode;
  };

type ContextValue = {
  age: Age | null;
  changeAge: (age: Age | null) => void;
  startGame: () => void;
  flipElement: (elementId: string) => void;
  bringElement: (elementId: string, direction: string) => void;
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

const _WebSocketProvider = ({
  children,
  gameElements,
  onSetElements,
  onMoveElement,
  onAddElements,
  onFlipElement,
  onBringElement,
}: Props) => {
  const [age, setAge] = useState<Age | null>(null);

  useEffect(() => {
    socket.on(YOU_START, () => {
      startGame();
    });

    socket.on(SET_STATE, (data: SetStateAPIEvent) => {
      onSetElements(data.elements);
      setAge(data.age);
    });

    socket.on(SET_ELEMENTS, (data: SetElementsAPIEvent) => {
      onSetElements(data);
    });

    socket.on(MOVE_ELEMENT, (data: MoveElementAPIEvent) => {
      const { elementsIds, delta } = data;

      elementsIds.forEach((id) => {
        onMoveElement(id, delta);
      });
    });

    socket.on(ADD_ELEMENTS, (data: AddElementsAPIEvent) => {
      onAddElements(data);
    });

    socket.on(FLIP_ELEMENT, (data: FlipElementAPIEvent) => {
      onFlipElement(data.elementId);
    });

    socket.on(BRING_ELEMENT, (data: BringElementAPIEvent) => {
      onBringElement(data.elementId, data.direction);
    });

    socket.on(SET_AGE, (data: SetAgeAPIEvent) => {
      setAge(data.age);
    });
  }, []);

  useEffect(() => {
    const eventPayload: SetStateAPIEvent = { elements: gameElements, age };

    socket.off(GET_STATE).on(GET_STATE, () => {
      socket.emit(SET_STATE, eventPayload);
    });
  }, [gameElements, age]);

  const moveElement = (elementsIds: Array<string>, delta: Coordinates) => {
    const apiEvent: MoveElementAPIEvent = { elementsIds, delta };

    socket.emit(MOVE_ELEMENT, apiEvent);
  };

  const flipElement = (elementId: string) => {
    const apiEvent: FlipElementAPIEvent = { elementId };

    socket.emit(FLIP_ELEMENT, apiEvent);
  };

  const bringElement = (elementId: string, direction: string) => {
    const apiEvent: BringElementAPIEvent = { elementId, direction };

    socket.emit(BRING_ELEMENT, apiEvent);
  };

  const addElements = (elements: Array<GameElement>) => {
    const apiEvent: AddElementsAPIEvent = elements;

    socket.emit(ADD_ELEMENTS, apiEvent);
  };

  const changeAge = (age: Age | null) => {
    setAge(age);
    socket.emit(SET_AGE, { age });
  };

  const startGame = () => {
    const initialElements = [
      ...getProgressTokens(),
      ...getMilitaryTokens(),
      ...generateCoins(),
      ...generateWonderCards(),
      generateConflictPawn(),
    ];

    socket.emit(SET_ELEMENTS, initialElements as SetElementsAPIEvent);
    onSetElements(initialElements);
    changeAge(null);
  };

  const providerValue: ContextValue = useMemo(
    () => ({
      age,
      changeAge,
      startGame,
      flipElement,
      bringElement,
      moveElement,
      addElements,
    }),
    [age, changeAge, startGame, flipElement, bringElement, moveElement, addElements],
  );

  return <WebSocketContext.Provider value={providerValue}>{children}</WebSocketContext.Provider>;
};

const mapStateToProps = (state: AppState): StateProps => ({
  gameElements: getElements(state),
});

const mapDispatchToProps: DispatchProps = {
  onSetElements: (elements) => setElements(elements),
  onAddElements: (elements) => addElements(elements),
  onMoveElement: (elementId, position) => moveElement(elementId, position),
  onFlipElement: (elementId) => flipElement(elementId),
  onBringElement: (elementId, direction) => bringElement(elementId, direction),
};

export const WebSocketProvider = connect(mapStateToProps, mapDispatchToProps)(_WebSocketProvider);
