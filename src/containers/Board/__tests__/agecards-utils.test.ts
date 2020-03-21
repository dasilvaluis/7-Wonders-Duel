import { getAgeScheme, getAgeCardsPlacement } from "../agecards-utils"

describe('getAgeCardsPlacement', () => {
  it('places first age cards', () => {
    expect(getAgeCardsPlacement(getAgeScheme('I'))).toMatchSnapshot();
  });

  it('places second age cards', () => {
    expect(getAgeCardsPlacement(getAgeScheme('II'))).toMatchSnapshot();
  });

  it('places third age cards', () => {
    expect(getAgeCardsPlacement(getAgeScheme('III'))).toMatchSnapshot();
  });
});
