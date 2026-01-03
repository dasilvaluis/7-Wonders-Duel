import { GameElements } from '../../types';
import { generateBuildingCards, getAgeScheme, getBuildingCardsPlacement } from '../buildingCards';
import * as utils from '../utils';

describe('utils > buildingCards', () => {
  describe('getBuildingCardsPlacement', () => {
    it('places first age cards', () => {
      expect(getBuildingCardsPlacement(getAgeScheme('I'))).toMatchSnapshot();
    });

    it('places second age cards', () => {
      expect(getBuildingCardsPlacement(getAgeScheme('II'))).toMatchSnapshot();
    });

    it('places third age cards', () => {
      expect(getBuildingCardsPlacement(getAgeScheme('III'))).toMatchSnapshot();
    });
  });

  describe('getBuildingCards', () => {
    beforeAll(() => {
      jest.spyOn(utils, 'createElement').mockImplementation((el) => ({
        id: '',
        x: 0,
        y: 0,
        type: GameElements.BUILDING_CARD,
        faceDown: false,
        imageFile: '',
        imageFileBackface: '',
      }));

      jest.spyOn(utils, 'getRandomElements').mockImplementation((array, limit) => array.slice(0, limit));

      jest.spyOn(utils, 'shuffleArray').mockImplementation((array) => array);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('matches snapshot', () => {
      expect(generateBuildingCards('I')).toMatchSnapshot();
      expect(generateBuildingCards('II')).toMatchSnapshot();
      expect(generateBuildingCards('III')).toMatchSnapshot();
    });
  });
});
