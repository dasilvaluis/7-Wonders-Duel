import { getBuildingCards } from "../buildingcards-utils";
import * as utils from '../../../utils';
import { ElementTypes } from "../../../types";
import { getAgeScheme, getBuildingCardsPlacement } from "../buildingcards-utils"

describe('buildingcards-utils', () => {
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
      jest
        .spyOn(utils, 'createElement')
        .mockImplementation((el) => ({ 
          id: '',
          x: 0,
          y: 0,
          type: ElementTypes.BUILDING_CARD,
          faceDown: false,
          imageFile: '',
          imageFileBackface: ''
        }));

      jest
        .spyOn(utils, 'getRandomElements')
        .mockImplementation((array, limit) => array.slice(0, limit));

      jest
        .spyOn(utils, 'shuffleArray')
        .mockImplementation((array) => array);
    });

    it('matches snapshot', () => {
        expect(getBuildingCards('I')).toMatchSnapshot();
        expect(getBuildingCards('II')).toMatchSnapshot();
        expect(getBuildingCards('III')).toMatchSnapshot();
    });
  });
});
