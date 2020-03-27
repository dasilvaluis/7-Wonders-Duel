import { MAX_COINS_6, MAX_COINS_3, MAX_COINS_1, BOARD_WIDTH } from "../../contants";
import { ElementTypes, GameElement } from "../../types";
import { v4 as uuidv4 } from 'uuid';
import { movePositions, injectPositions, getElementSize } from "../../utils";

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
  const getRandomPositions = (variation: number, maxCoins: number) => {
    const positions = [];
    for (let index = 0; index < maxCoins; index++) {
      positions.push({
        x: Math.random() * variation,
        y: Math.random() * variation,
      })
    }

    return positions;
  }
  
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

  const variation = getElementSize(ElementTypes.COIN_1).width;
  return getRandomPositions(variation, maxCoins);
};

export const getCoins = (): Array<GameElement> => {
  const coindWidth6 = getElementSize(ElementTypes.COIN_6).width;
  const coindWidth3 = getElementSize(ElementTypes.COIN_3).width;
  const coindWidth1 = getElementSize(ElementTypes.COIN_1).width;

  const coinElements6 = getCoinElements(6);
  const coinElements3 = getCoinElements(3);
  const coinElements1 = getCoinElements(1);

  const coinPlacements6 = getCoinsPlacement(6);
  const coinPlacements3 = getCoinsPlacement(3);
  const coinPlacements1 = getCoinsPlacement(1);

  const coinPlacements6Shifted = movePositions(coinPlacements6, {
    x: BOARD_WIDTH - (coindWidth6 * 2),
    y: 0
  });

  const coinPlacements3Shifted = movePositions(coinPlacements3, {
    x: BOARD_WIDTH - (coindWidth3 * 2 + coindWidth6),
    y: 0
  });

  const coinPlacements1Shifted = movePositions(coinPlacements1, {
    x: BOARD_WIDTH - (coindWidth1 * 2 + coindWidth3 * 1.5 + coindWidth6),
    y: 0
  });

  const coins6 = injectPositions(coinElements6, coinPlacements6Shifted);
  const coins3 = injectPositions(coinElements3, coinPlacements3Shifted);
  const coins1 = injectPositions(coinElements1, coinPlacements1Shifted);

  return [
    ...coins6,
    ...coins3,
    ...coins1
  ];
};
