import { BOARD_WIDTH } from '../constants';
import { tokens as tokensDb } from '../data/progress-tokens.json';
import { GameElements, type Coordinates, type GameElement } from '../types';
import { createElement, getElementScale, getElementSize, getRandomElements, movePositions } from './utils';

const boardPosition = {
  x: (BOARD_WIDTH - getElementSize(GameElements.BOARD).width) / 2,
  y: 0,
};

export const generateBoardElement = (): GameElement => ({
  ...boardPosition,
  id: 'board',
  type: GameElements.BOARD,
  faceDown: false,
  imageFile: 'board.png',
  imageFileBackface: 'board.png',
});

export const getProgressTokens = (): Array<GameElement> => {
  const boardTokensCount = 5;
  const tokenWidth = getElementSize(GameElements.PROGRESS_TOKEN).width;
  const tokenScale = getElementScale(GameElements.PROGRESS_TOKEN);
  const boardScale = getElementScale(GameElements.BOARD);
  const shuffledTokens = getRandomElements(tokensDb);
  const boardTokens = shuffledTokens.slice(0, boardTokensCount);
  const hiddenTokens = shuffledTokens.slice(boardTokensCount);

  const boardTokensPlacement = boardTokens.map((el, index) => ({
    x: (tokenWidth + 5 * tokenScale) * index,
    y: 0,
  }));

  const placedBoardTokens: Array<GameElement> = boardTokens.map((token, index) => ({
    ...createElement(GameElements.PROGRESS_TOKEN),
    x: boardPosition.x + 95 * boardScale + boardTokensPlacement[index].x,
    y: boardPosition.y + 3.75 * boardScale,
    imageFile: token.file,
    imageFileBackface: 'token-progress-back.jpg',
  }));

  const placedHiddenTokens: Array<GameElement> = hiddenTokens.map((token, index) => ({
    ...createElement(GameElements.PROGRESS_TOKEN),
    faceDown: true,
    x: boardPosition.x + tokenWidth,
    y: boardPosition.y + 3 * boardScale,
    imageFile: token.file,
    imageFileBackface: 'token-progress-back.jpg',
  }));

  return [...placedBoardTokens, ...placedHiddenTokens];
};

export const getMilitaryTokens = (): Array<GameElement> => {
  const boardScale = getElementScale(GameElements.BOARD);
  const token5Height = getElementSize(GameElements.MILITARY_TOKEN_5).height;
  const token2Height = getElementSize(GameElements.MILITARY_TOKEN_2).height;

  const getMilitaryToken = (value: number) => {
    const imageFileBackface = 'token-military-back.jpg';

    switch (value) {
      case 5:
        return {
          ...createElement(GameElements.MILITARY_TOKEN_5),
          imageFileBackface,
          imageFile: 'token-military-5.jpg',
        };
      default:
        return {
          ...createElement(GameElements.MILITARY_TOKEN_2),
          imageFileBackface,
          imageFile: 'token-military-2.jpg',
        };
    }
  };

  const tokensPlacement: Array<Coordinates> = [
    {
      x: 0,
      y: 0,
    },
    {
      x: 60 * boardScale,
      y: (token5Height - token2Height) / 2,
    },
    {
      x: 210 * boardScale,
      y: (token5Height - token2Height) / 2,
    },
    {
      x: 263 * boardScale,
      y: 0,
    },
  ];

  const tokensPlacementShifted = movePositions(tokensPlacement, {
    x: boardPosition.x + 40 * boardScale,
    y: boardPosition.y + 81.5 * boardScale,
  });

  const tokens = [5, 2, 2, 5].map((el, index) => ({
    ...getMilitaryToken(el),
    ...tokensPlacementShifted[index],
  }));

  return tokens;
};

export const generateConflictPawn = (): GameElement => {
  const { width: pawnWidth, height: pawnHeight } = getElementSize(GameElements.CONFLICT_PAWN);
  const boardWidth = getElementSize(GameElements.BOARD).width;

  return {
    ...createElement(GameElements.CONFLICT_PAWN),
    x: boardPosition.x + (boardWidth - pawnWidth) / 2 - 4,
    y: boardPosition.y + pawnHeight - 8,
    imageFile: 'conflict-pawn.png',
    imageFileBackface: 'conflict-pawn-back.png',
  };
};
