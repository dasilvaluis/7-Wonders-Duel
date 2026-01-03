import { generateBoardElement, generateConflictPawn, getMilitaryTokens, getProgressTokens } from '../board';
import * as utils from '../utils';

describe('utils > board', () => {
  beforeAll(() => {
    jest
      .spyOn(utils, 'createElement')
      .mockImplementation(() => ({ 
        id: '',
        x: 0,
        y: 0,
        type: 'mock',
        faceDown: false,
        imageFile: '',
        imageFileBackface: ''
      }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('getConflictPawn', () => {
    it('matches snapshot', () => {
      expect(generateConflictPawn()).toMatchSnapshot();
    });
  });

  describe('getMilitaryTokens', () => {
    it('matches snapshot', () => {
      expect(getMilitaryTokens()).toMatchSnapshot();
    });
  });

  describe('getProgressTokens', () => {
    it('matches snapshot', () => {
      jest
        .spyOn(utils, 'getRandomElements')
        .mockImplementation((array, limit) => array.slice(0, limit));

      expect(getProgressTokens()).toMatchSnapshot();
    });
  });

  describe('getBoardElement', () => {
    it('matches snapshot', () => {
      expect(generateBoardElement()).toMatchSnapshot();
    });
  });
});