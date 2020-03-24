import { CARD_MARGIN, BOARD_WIDTH, BOARD_HEIGHT } from '../../contants';
import { Position, GameElement } from '../../types';

export const getRowOf = (howMany: number, cardWidth: number): Array<Position> => {
  const positions = []

  for (let index = 0; index < howMany; index++) {
    positions.push({
      x: (cardWidth + CARD_MARGIN) * index,
      y: 0
    });
  }

  return positions;
};

export const centerRow = (row: Array<Position>, cardsQuantity: number, cardWidth: number) =>
  row.map((position) => ({
    ...position,
    x: position.x - (cardsQuantity * cardWidth + (cardsQuantity - 1) * CARD_MARGIN) / 2
  }));

export const centerHorizontally = (positions: Array<Position>) =>
  movePositions(positions, {
    x: BOARD_WIDTH / 2,
    y: 0
  });

export const centerVertically = (positions: Array<Position>, elementsHeight: number) =>
  movePositions(positions, {
    x: 0,
    y: (BOARD_HEIGHT - elementsHeight)/ 2
  });

export const movePositions = (positions: Array<Position>, offset: Position) => 
  positions.map((position) => ({
    x: position.x + offset.x,
    y: position.y + offset.y
  }));

export const injectPositions = <T>(elements: Array<T>, positions: Array<Position>) =>
  elements.reduce((cards, card, index) => {
    if (index < positions.length) {
      const { x, y } = { x: positions[index].x, y: positions[index].y };

      return [ ...cards, { ...card, x, y } ];
    }

    return cards;
  }, []);

export const shuffleArray = <T>(array: Array<T>) => [ ...array ].sort(() => Math.random() - 0.5);

export const getRandomElements = <T>(array: Array<T>, howMany: number) => {
  const shuffledElements = shuffleArray<T>(array);
  const limit = howMany < shuffledElements.length ? howMany : shuffledElements.length;

  return shuffledElements.slice(0, limit);
};

export const flipCards = (cards: Array<GameElement>) => cards.map((card) => ({ ...card, faceDown: true }));