export type ElementsMap = {
  [key: string]: GameElement
}

export type Age = 'I' | 'II' | 'III';

export enum ElementTypes {
  MOCK = 'mock',
  WONDER_CARD = 'wonder',
  BUILDING_CARD = 'building',
  MILITARY_TOKEN_5 = 'military_token_5',
  MILITARY_TOKEN_2 = 'military_token_2',
  PROGRESS_TOKEN = 'progress_token',
  CONFLICT_PAWN = 'conflict_pawn',
  COIN_1 = 'coin_1',
  COIN_3 = 'coin_3',
  COIN_6 = 'coin_6',
  BOARD = 'board'
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface DraggedData extends Coordinates {
  deltaX: number;
  deltaY: number;
}

export interface GameElement extends Coordinates {
  id: string;
  type: ElementTypes;
  faceDown: boolean;
  imageFile: string;
  imageFileBackface: string;
}

export interface MoveElementAPIEvent {
  elementsIds: Array<string>;
  delta: Coordinates;
}

export interface FlipElementAPIEvent {
  elementId: string;
}

export interface BringElementAPIEvent {
  elementId: string;
  direction: string;
}

export interface SetAgeAPIEvent {
  age: Age | null;
}

export interface SetStateAPIEvent {
  elements: Array<GameElement>;
  age: Age | null;
}

export interface SetElementsAPIEvent extends Array<GameElement> {}

export interface AddElementsAPIEvent extends Array<GameElement> {}
