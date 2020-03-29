import { getConflictPawn, getMilitaryTokens, getProgressTokens, getBoardElement } from "../board-utils";
import * as utils from '../../../utils';
import { ElementTypes } from "../../../types";

describe('board-utils', () => {
  beforeAll(() => {
    jest
      .spyOn(utils, 'createElement')
      .mockImplementation((el) => ({ 
        id: '',
        x: 0,
        y: 0,
        type: ElementTypes.MOCK,
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
      expect(getConflictPawn()).toMatchSnapshot();
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
      expect(getBoardElement()).toMatchSnapshot();
    });
  });
});