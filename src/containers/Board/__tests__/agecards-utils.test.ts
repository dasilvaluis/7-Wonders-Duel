import { getAgeScheme, getBuildingCardsPlacement } from "../buildingcards-utils"
import { CARD_WIDTH } from "../../../contants";

describe('getBuildingCardsPlacement', () => {
  it('places first age cards', () => {
    expect(getBuildingCardsPlacement(getAgeScheme('I'), CARD_WIDTH)).toMatchSnapshot();
  });

  it('places second age cards', () => {
    expect(getBuildingCardsPlacement(getAgeScheme('II'), CARD_WIDTH)).toMatchSnapshot();
  });

  it('places third age cards', () => {
    expect(getBuildingCardsPlacement(getAgeScheme('III'), CARD_WIDTH)).toMatchSnapshot();
  });
});
