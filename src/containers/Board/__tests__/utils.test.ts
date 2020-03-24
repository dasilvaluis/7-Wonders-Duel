import { movePositions, getRandomElements } from "../utils";

describe('movePositions', () => {
  const positions = [
    {
      x: 0,
      y: 0
    },
    {
      x: 1,
      y: 2
    }
  ];

  it('moves positions by offset', () => {
    expect(movePositions(positions, { x: 0, y: 0 })).toEqual(positions);
    expect(movePositions(positions, { x: 10, y: 20 })).toEqual([
      {
        x: 10,
        y: 20
      },
      {
        x: 11,
        y: 22
      }
    ]);
  });
});

describe('getRandomElements', () => {
  const array = [1, 2, 3, 4, 5];

  it('returns random elements of an array up to a given limit', () => {
    expect(getRandomElements(array, array.length - 1)).toHaveLength(array.length - 1);
    expect(getRandomElements(array, array.length - 2)).toHaveLength(array.length - 2);
  });

  it('returns randomized array if limit is equal to arrays length', () => {
    expect(getRandomElements(array, array.length)).not.toEqual(array);
    expect(getRandomElements(array, array.length)).toHaveLength(array.length);
  });

  it('same input does snot create the same output twice', () => {
    expect(getRandomElements(array, array.length)).not.toEqual(getRandomElements(array, array.length));
  });
});
