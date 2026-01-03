import { WEBSOCKET_EVENTS } from '../../constants';
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
import socket from '../../wsClient';

export const emitMoveElement = (elementsIds: Array<string>, delta: Coordinates) => {
  const apiEvent: MoveElementAPIEvent = { elementsIds, delta };

  socket.emit(WEBSOCKET_EVENTS.MOVE_ELEMENT, apiEvent);
};

export const emitFlipElement = (elementId: string) => {
  const apiEvent: FlipElementAPIEvent = { elementId };

  socket.emit(WEBSOCKET_EVENTS.FLIP_ELEMENT, apiEvent);
};

export const emitBringElement = (elementId: string, direction: 'front' | 'back') => {
  const apiEvent: BringElementAPIEvent = { elementId, direction };

  socket.emit(WEBSOCKET_EVENTS.BRING_ELEMENT, apiEvent);
};

export const emitAddElements = (elements: Array<GameElement>) => {
  const apiEvent: AddElementsAPIEvent = elements;

  socket.emit(WEBSOCKET_EVENTS.ADD_ELEMENTS, apiEvent);
};

export const emitSetAge = (age: Age | null) => {
  const apiEvent: SetAgeAPIEvent = { age };

  socket.emit(WEBSOCKET_EVENTS.SET_AGE, apiEvent);
};

export const emitSetElements = (elements: SetElementsAPIEvent) => {
  socket.emit(WEBSOCKET_EVENTS.SET_ELEMENTS, elements);
};

export const emitSetState = (elements: GameElement[], age: Age | null) => {
  const apiEvent: SetStateAPIEvent = { elements, age };

  socket.emit(WEBSOCKET_EVENTS.SET_STATE, apiEvent);
};
