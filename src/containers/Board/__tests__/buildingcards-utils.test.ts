import { getAgeScheme, getBuildingCardsPlacement } from "../buildingcards-utils"

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
