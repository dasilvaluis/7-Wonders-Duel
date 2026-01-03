export type ElementsMap = {
  [key: string]: GameElement
}

export type Age = 'I' | 'II' | 'III';

export const GameElements = {
  MOCK: 'mock',
  WONDER_CARD: 'wonder',
  BUILDING_CARD: 'building',
  MILITARY_TOKEN_5: 'military_token_5',
  MILITARY_TOKEN_2: 'military_token_2',
  PROGRESS_TOKEN: 'progress_token',
  CONFLICT_PAWN: 'conflict_pawn',
  COIN_1: 'coin_1',
  COIN_3: 'coin_3',
  COIN_6: 'coin_6',
  BOARD: 'board'
} as const;

export type GameElementTypes = typeof GameElements[keyof typeof GameElements];

export type Coordinates = {
  x: number;
  y: number;
}

export type DraggedData = Coordinates & {
  deltaX: number;
  deltaY: number;
}

export type GameElement = Coordinates & {
  id: string;
  type: GameElementTypes;
  faceDown: boolean;
  imageFile: string;
  imageFileBackface: string;
}

export type Player = 'playerA' | 'playerB';

export type MoveElementAPIEvent = {
  elementsIds: Array<string>;
  delta: Coordinates;
};

export type FlipElementAPIEvent = {
  elementId: string;
};

export type BringElementAPIEvent = {
  elementId: string;
  direction: string;
};

export type SetAgeAPIEvent = {
  age: Age | null;
};

export type SetStateAPIEvent = {
  elements: Array<GameElement>;
  age: Age | null;
};

export type SetElementsAPIEvent = Array<GameElement>;

export type AddElementsAPIEvent = Array<GameElement>;

export type SetScoreAPIEvent = {
  player: Player,
  value: number,
  scoreType: string
};
