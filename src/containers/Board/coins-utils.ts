import { MAX_COINS_6, MAX_COINS_3, MAX_COINS_1, COIN_WIDTH_6, COIN_WIDTH_3, COIN_WIDTH_1, BOARD_WIDTH, CARD_MARGIN } from "../../contants";
import { ElementTypes, GameElement } from "../../types";
import { v4 as uuidv4 } from 'uuid';
import { movePositions, injectPositions } from "../../utils";

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

export const getCoins = (): Array<GameElement> => {
  const coinElements6 = getCoinElements(6);
  const coinElements3 = getCoinElements(3);
  const coinElements1 = getCoinElements(1);

  const coinPlacements6 = getCoinsPlacement(6);
  const coinPlacements3 = getCoinsPlacement(3);
  const coinPlacements1 = getCoinsPlacement(1);

  const coinPlacements6Shifted = movePositions(coinPlacements6, {
    x: BOARD_WIDTH - COIN_WIDTH_6 * 2.5 - CARD_MARGIN,
    y: CARD_MARGIN
  });

  const coinPlacements3Shifted = movePositions(coinPlacements3, {
    x: BOARD_WIDTH - COIN_WIDTH_3 * 2.5 - CARD_MARGIN,
    y: CARD_MARGIN + COIN_WIDTH_6 * 1.5
  });

  const coinPlacements1Shifted = movePositions(coinPlacements1, {
    x: BOARD_WIDTH - COIN_WIDTH_1 * 2.5 - CARD_MARGIN,
    y: CARD_MARGIN + COIN_WIDTH_3 * 3.5
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
