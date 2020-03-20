import { movePositions, shuffleAndLimitArray, flattenMultiLevelArray } from "../utils";
import { MAX_CARDS } from "../../../contants";

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


describe('shuffleAndLimitArray', () => {
  const array = [1, 2, 3, 4, 5];

  it('gets an array of stuff and shuffles it', () => {
    expect(shuffleAndLimitArray(array, MAX_CARDS).length).toBe(shuffleAndLimitArray(array, MAX_CARDS).length);
    expect(shuffleAndLimitArray(array, MAX_CARDS)).not.toEqual(array);
    expect(shuffleAndLimitArray(array, MAX_CARDS)).not.toEqual(shuffleAndLimitArray(array, MAX_CARDS));
  });

  it('limits the output length to a given limit', () => {
    expect(shuffleAndLimitArray(Array(MAX_CARDS + 1).fill(0), MAX_CARDS).length).toBeLessThanOrEqual(MAX_CARDS);
  });
});

describe('flattenMultiLevelArray', () => {
  const array = [1, 2, 3, 4, 5];
  const multiLevelArray = [
    [1, 2],
    [3, 4],
    [5]
  ];

  it('flattens the given array', () => {
    expect(flattenMultiLevelArray(multiLevelArray)).toEqual(array);
  });
});
