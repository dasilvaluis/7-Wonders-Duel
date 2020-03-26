import { getAgeScheme, getBuildingCardsPlacement } from "../buildingcards-utils"
import { BUILDING_WIDTH } from "../../../contants";

describe('getBuildingCardsPlacement', () => {
  it('places first age cards', () => {
    expect(getBuildingCardsPlacement(getAgeScheme('I'), BUILDING_WIDTH)).toMatchSnapshot();
  });

  it('places second age cards', () => {
    expect(getBuildingCardsPlacement(getAgeScheme('II'), BUILDING_WIDTH)).toMatchSnapshot();
  });

  it('places third age cards', () => {
    expect(getBuildingCardsPlacement(getAgeScheme('III'), BUILDING_WIDTH)).toMatchSnapshot();
  });
});
