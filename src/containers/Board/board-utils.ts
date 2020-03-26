import { CARD_MARGIN, BOARD_WIDTH, BOARD_HEIGHT, MAX_COINS_6, COIN_WIDTH_6, COIN_WIDTH_1, COIN_WIDTH_3, MAX_COINS_3, MAX_COINS_1 } from '../../contants';
import { Position, GameElement, ElementTypes } from '../../types';
import { v4 as uuidv4 } from 'uuid';

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

export const getBoardElement = (): GameElement => ({
  id: 'board',
  x: 120,
  y: 0,
  type: ElementTypes.BOARD,
  faceDown: false,
  imageFile: 'board.png',
  imageFileBackface: 'board.png'
});

export const getCoinElement = (value: 1 | 3 | 6): GameElement => {
  const base = {
    id: uuidv4(),
    x: 0,
    y: 0,
    faceDown: false,
    imageFile: `coin-${value}.jpg`,
    imageFileBackface: `coin-${value}-back.jpg`
  };

  switch (value) {
    case 6:
      return {
        ...base,
        type: ElementTypes.COIN_6
      };
    case 3:
      return {
        ...base,
        type: ElementTypes.COIN_3
      };
    default:
      return {
        ...base,
        type: ElementTypes.COIN_1
      };
  }
};

export const getCoinElements = (value: 1 | 3 | 6): Array<GameElement> => {
  let maxCoins = 0;
  switch (value) {
    case 6:
      maxCoins = MAX_COINS_6;
      break;
    case 3:
      maxCoins = MAX_COINS_3;
      break;
    default:
      maxCoins = MAX_COINS_1;
      break;
  }

  const elements = [];
  for (let index = 0; index < maxCoins; index++) {
    elements.push(getCoinElement(value))
  }

  return elements;
};

export const getCoinsPlacement = (value: 1 | 3 | 6) => {
  const getRandomPositions = (coinWidth: number, maxCoins: number) => {
    const positions = [];
    for (let index = 0; index < maxCoins; index++) {
      positions.push({
        x: Math.random() * coinWidth,
        y: Math.random() * coinWidth,
      })
    }

    return positions;
  }

  let coinWidth = 0;
  let maxCoins = 0;
  switch (value) {
    case 6:
      coinWidth = COIN_WIDTH_6;
      maxCoins = MAX_COINS_6;
      break;
    case 3:
      coinWidth = COIN_WIDTH_3;
      maxCoins = MAX_COINS_3;
      break;
    default:
      coinWidth = COIN_WIDTH_1;
      maxCoins = MAX_COINS_1;
      break;
  }

  return getRandomPositions(coinWidth, maxCoins);
};
