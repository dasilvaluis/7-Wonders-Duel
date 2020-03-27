import { GameElement, ElementTypes, Position } from "../../types";
import { tokens as tokensDb } from '../../data/progress-tokens.json';
import { getRandomElements, createElement, getElementScale, getElementSize, movePositions } from "../../utils";
import { CARD_MARGIN } from "../../contants";

const boardPosition = {
  x: 150,
  y: CARD_MARGIN,
};

export const getBoardElement = (): GameElement => ({
  ...boardPosition,
  id: 'board',
  type: ElementTypes.BOARD,
  faceDown: false,
  imageFile: 'board.png',
  imageFileBackface: 'board.png'
});

export const getProgressTokens = (): Array<GameElement> => {
  const boardTokensCount = 5;
  const tokenWidth = getElementSize(ElementTypes.PROGRESS_TOKEN).width;
  const boardHeight = getElementSize(ElementTypes.BOARD).height;
  const tokenScale = getElementScale(ElementTypes.PROGRESS_TOKEN);
  const boardScale = getElementScale(ElementTypes.BOARD);
  const shuffledTokens = getRandomElements(tokensDb);
  const boardTokens = shuffledTokens.slice(0, boardTokensCount);
  const hiddenTokens = shuffledTokens.slice(boardTokensCount);

  const boardTokensPlacement = boardTokens.map((el, index) => ({
    x: 0,
    y: (tokenWidth + 3.9 * tokenScale) * index
  }));

  const placedBoardTokens: Array<GameElement> = boardTokens.map((token , index) => ({
    ...createElement(ElementTypes.PROGRESS_TOKEN),
    x: boardPosition.x + 4 * boardScale,
    y: boardPosition.y + 101 * boardScale + boardTokensPlacement[index].y,
    imageFile: token.file,
    imageFileBackface: 'token-progress-back.jpg'
  }));

  const placedHiddenTokens: Array<GameElement> = hiddenTokens.map((token , index) => ({
    ...createElement(ElementTypes.PROGRESS_TOKEN),
    faceDown: true,
    x: boardPosition.x - (tokenWidth + 10 * boardScale),
    y: boardPosition.y + (boardHeight - tokenWidth) / 2,
    imageFile: token.file,
    imageFileBackface: 'token-progress-back.jpg'
  }));

  return [ ...placedBoardTokens, ...placedHiddenTokens ];
};

export const getMilitaryTokens = (): Array<GameElement> => {
  const boardScale = getElementScale(ElementTypes.BOARD);
  const token5Width = getElementSize(ElementTypes.MILITARY_TOKEN_5).width;
  const token2Width = getElementSize(ElementTypes.MILITARY_TOKEN_2).width;

  const getMilitaryToken = (value) => {
    const imageFileBackface = 'token-military-back.jpg';

    switch (value) {
      case 5:
        return {
          ...createElement(ElementTypes.MILITARY_TOKEN_5),
          imageFileBackface,
          imageFile: 'token-military-5.jpg'
        };
      default:
        return {
          ...createElement(ElementTypes.MILITARY_TOKEN_2),
          imageFileBackface,
          imageFile: 'token-military-2.jpg'
        };
    }
  };

  const tokensPlacement: Array<Position> = [
    {
      x: 0,
      y: 0
    },
    {
      x: (token5Width - token2Width) / 2,
      y: 60.5 * boardScale
    },
    {
      x: (token5Width - token2Width) / 2,
      y: 210.5 * boardScale
    },
    {
      x: 0,
      y: 263 * boardScale
    }
  ];
  
  const tokensPlacementShifted = movePositions(tokensPlacement, {
    x: boardPosition.x + 81.5 * boardScale,
    y: boardPosition.y + 42 * boardScale
  });

  const tokens = [5, 2, 2, 5].map((el, index) => ({
    ...getMilitaryToken(el),
    ...tokensPlacementShifted[index]
  }));

  return tokens;
};
