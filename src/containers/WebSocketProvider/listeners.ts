import { WEBSOCKET_EVENTS } from '../../constants';
import type {
  AddElementsAPIEvent,
  BringElementAPIEvent,
  Direction,
  FlipElementAPIEvent,
  MoveElementAPIEvent,
  SetAgeAPIEvent,
  SetElementsAPIEvent,
  SetStateAPIEvent,
} from '../../types';
import socket from '../../wsClient';

export const socketListeners = (callbacks: {
  onYouStart: () => void;
  onSetElements: (elements: any) => void;
  onMoveElement: (id: string, delta: { x: number; y: number }) => void;
  onAddElements: (data: AddElementsAPIEvent) => void;
  onFlipElement: (elementId: string) => void;
  onBringElement: (elementId: string, direction: Direction) => void;
  onSetAge: (age: null | 'I' | 'II' | 'III') => void;
}) => {
  socket.on(WEBSOCKET_EVENTS.YOU_START, () => {
    callbacks.onYouStart();
  });

  socket.on(WEBSOCKET_EVENTS.SET_STATE, (data: SetStateAPIEvent) => {
    callbacks.onSetElements(data.elements);
  });

  socket.on(WEBSOCKET_EVENTS.SET_ELEMENTS, (data: SetElementsAPIEvent) => {
    callbacks.onSetElements(data);
  });

  socket.on(WEBSOCKET_EVENTS.MOVE_ELEMENT, (data: MoveElementAPIEvent) => {
    data.elementsIds.forEach((id) => {
      callbacks.onMoveElement(id, data.delta);
    });
  });

  socket.on(WEBSOCKET_EVENTS.ADD_ELEMENTS, (data: AddElementsAPIEvent) => {
    callbacks.onAddElements(data);
  });

  socket.on(WEBSOCKET_EVENTS.FLIP_ELEMENT, (data: FlipElementAPIEvent) => {
    callbacks.onFlipElement(data.elementId);
  });

  socket.on(WEBSOCKET_EVENTS.BRING_ELEMENT, (data: BringElementAPIEvent) => {
    callbacks.onBringElement(data.elementId, data.direction);
  });

  socket.on(WEBSOCKET_EVENTS.SET_AGE, (data: SetAgeAPIEvent) => {
    callbacks.onSetAge(data.age);
  });

  return () => {
    socket.off();
  };
};
