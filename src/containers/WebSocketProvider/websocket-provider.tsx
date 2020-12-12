import React, { createContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  SET_ELEMENTS, BRING_ELEMENT, ADD_ELEMENTS, FLIP_ELEMENT, MOVE_ELEMENT, SET_AGE, GET_STATE, SET_STATE, YOU_START
} from '../../contants';
import {
  Coordinates, GameElement, Age, MoveElementAPIEvent, FlipElementAPIEvent, 
  AddElementsAPIEvent, SetElementsAPIEvent, BringElementAPIEvent,
  SetAgeAPIEvent, SetStateAPIEvent
} from '../../types';
import { getElements } from '../../reducers/selectors';
import { setElements, flipElement, addElements, bringElement, moveElement } from '../../actions/elements-actions';
import { AppState } from '../../reducers/reducers';
import { getProgressTokens, getMilitaryTokens, generateConflictPawn } from '../../utils/board-utils';
import { generateCoins } from '../../utils/coins-utils';
import socket  from '../../wsClient';
import { generateWonderCards } from '../../utils/wondercards-utils';

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

type Props = StateProps & DispatchProps;

export const WebSocketContext = createContext(null);

const _WebSocketProvider: React.FC<Props> = ({
  children,
  gameElements,
  onSetElements,
  onMoveElement,
  onAddElements,
  onFlipElement,
  onBringElement,
}) => {
  const [ age, setAge ] = useState<Age | null>(null);

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

    socket
      .off(GET_STATE)
      .on(GET_STATE, () => {
        socket.emit(SET_STATE, eventPayload);
      });
  }, [ gameElements, age ]);

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
      generateConflictPawn()
    ];

    socket.emit(SET_ELEMENTS, initialElements as SetElementsAPIEvent);
    onSetElements(initialElements);
    changeAge(null);
  }

  const providerValue = {
    age,
    changeAge,
    startGame,
    flipElement,
    bringElement,
    moveElement,
    addElements
  };

  return (
    <WebSocketContext.Provider value={ providerValue }>
      { children }
    </WebSocketContext.Provider>
  )
};

const mapStateToProps = (state: AppState): StateProps => ({
  gameElements: getElements(state)
});

const mapDispatchToProps: DispatchProps = {
  onSetElements: (elements) => setElements(elements),
  onAddElements: (elements) => addElements(elements),
  onMoveElement: (elementId, position) => moveElement(elementId, position),
  onFlipElement: (elementId) => flipElement(elementId),
  onBringElement: (elementId, direction) => bringElement(elementId, direction)
};

export const WebSocketProvider = connect(
  mapStateToProps,
  mapDispatchToProps
)(_WebSocketProvider);
