import { getAgeScheme, getBuildingCardsPlacement, getShuffledCards } from "../buildingcards-utils"
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

describe('getShuffledCards', () => {
  it('shuffle first age cards', () => {
    expect(getShuffledCards('I')).toMatchSnapshot();
  });

  it('shuffle second age cards', () => {
    expect(getShuffledCards('II')).toMatchSnapshot();
  });

  it('shuffle third age/guild cards', () => {
    expect(getShuffledCards('III')).toMatchSnapshot();
    expect(getShuffledCards('G')).toMatchSnapshot();
  });
});
