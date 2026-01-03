import { useMemo } from 'react';
import type { Age } from '../../types';

type Props = {
  age: Age;
  currentAge: Age | null;
  onClick(age: Age): void;
};

export default (props: Props) => {
  const ages: Array<Age> = ['I', 'II', 'III'];
  const ageIndex = useMemo<number>(() => ages.findIndex((el) => el === props.age), [ages, props.age]);
  const currentAgeIndex = useMemo<number>(
    () => ages.findIndex((el) => el === props.currentAge),
    [ages, props.currentAge],
  );
  const active = ageIndex <= currentAgeIndex;
  const takingOneStep = currentAgeIndex + 1 === ageIndex;

  return (
    <li className={`age-progress__dot ${props.age && active ? '-active' : ''}`}>
      <button onClick={() => props.onClick(props.age)} disabled={!takingOneStep}>
        {props.age}
      </button>
    </li>
  );
};
