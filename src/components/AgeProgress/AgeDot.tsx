import React, { useMemo } from 'react';
import { Age } from '../../types';

interface Props {
  age: Age;
  currentAge: Age | null;
  onClick(age: Age): void;
}

export default (props: Props) => {
  const ages: Array<Age> = [ 'I', 'II', 'III' ];
  const ageIndex = useMemo<number>(() => ages.findIndex((el) => el === props.age), [ ages, props.age ]);
  const currentAgeIndex = useMemo<number>(() => ages.findIndex((el) => el === props.currentAge), [ ages, props.currentAge ]);

  const isActive = () => ageIndex <= currentAgeIndex;
  const isTakingOneStep = () => currentAgeIndex + 1 === ageIndex;

  return ( 
    <li 
      data-age={ props.age }
      className={`age-progress__dot ${ props.age && isActive() ? '-active' : '' }`}
    >
      <button onClick={() => props.onClick(props.age)} disabled={!isTakingOneStep()}>{ props.age }</button>
    </li> 
  );
}