export type ElementsMap = {
  [key: string]: GameElement
}

export type Age = 'I' | 'II' | 'III' | 'G';

export enum ElementTypes {
  WONDER_CARD = 'wonder',
  BUILDING_CARD = 'building',
  MILITARY_TOKEN = 'military_token',
  PROGRESS_TOKEN = 'progress_token',
  CONFLICT_PAWN = 'conflict_pawn',
  COIN = 'coin'
}

export interface Position {
  x: number;
  y: number;
}

export interface GameElement extends Position {
  id: string;
  name: string;
  type: ElementTypes;
  faceDown: boolean;
  imageFile: string;
  imageFileBackface: string;
}
