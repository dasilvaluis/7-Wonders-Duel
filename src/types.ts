export type ElementTypes = {
  WONDER_CARD: 'wonder',
  BUILDING_CARD: 'building',
  MILITARY_TOKEN: 'military_token',
  PROGRESS_TOKEN: 'progress_token',
  CONFLICT_PAWN: 'conflict_pawn'
}

export interface Position {
  x: number;
  y: number;
}

export interface GameElement extends Position {
  name: string;
  type: ElementTypes;
  faceDown: boolean;
}
