import { CARD_WIDTH, CARD_MARGIN, CARD_HEIGHT, BOARD_WIDTH } from '../../contants';
import { Position } from '../../types';

export const schemeFirstEra = [ 2, 3, 4, 5, 6 ];
export const schemeSecondEra = [ 6, 5, 4, 3, 2 ];
export const schemeThirdEra = [ 2, 3, 4, 3, 4, 2 ];

const getRowOf = (howMany: number) => {
  const positions = []

  for (let index = 0; index < howMany; index++) {
    positions.push({
      x: (CARD_WIDTH + CARD_MARGIN) * index,
      y: 0
    });
  }

  return positions;
};

export const flattenMultiLevelArray = <T>(rows: T[][]) => rows.reduce((acc, curr) => [ ...acc, ...curr ], []);

const moveRowVertically = (row: Array<Position>, rowIndex: number) => row.map((position) => ({
  ...position,
  y: rowIndex * (CARD_HEIGHT / 3.5)
}));

const centerRow = (row: Array<Position>, cardsQuantity: number) => row.map((position) => ({
  ...position,
  x: position.x - (cardsQuantity * CARD_WIDTH + (cardsQuantity - 1) * CARD_MARGIN) / 2
}));

const centerCards = (cards: Array<Position>) =>
  movePositions(cards, {
    x: BOARD_WIDTH / 2,
    y: 0
  });

export const movePositions = (positions: Array<Position>, offset: Position) => 
  positions.map((position) => ({
    x: position.x + offset.x,
    y: position.y + offset.y
  }));

export const getCardsPlacement = (scheme: Array<number>) => {
  const rows = scheme.map((cardsQuantity, rowIndex) => {
    const row = getRowOf(cardsQuantity);
    const rowMovedVertically = moveRowVertically(row, rowIndex);
    const rowCentered = centerRow(rowMovedVertically, cardsQuantity);

    return rowCentered;
  });

  return centerCards(flattenMultiLevelArray<Position>(rows));
};


export const shuffleAndLimitArray = <T>(elements: T[], limit: number) => {
  const shuffledCards = [ ...elements ].sort(() => Math.random() - 0.5);
  while (shuffledCards.length > limit) {
    shuffledCards.pop();
  }
  
  return shuffledCards;
};