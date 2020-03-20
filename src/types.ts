export interface CardInterface extends Position {
  name: string,
  type: string,
  cost?: { 
    [key: string ]: number
  },
  effect?: {
    [key: string ]: number | string
  }
}

export interface Position {
  x: number;
  y: number;
}
