import React from 'react';
import { Age } from '../../types';
import './AgeProgress.scss';
import AgeDot from './AgeDot';

interface Props {
  age: Age | null;
  onChange(age: Age): void;
}

export default (props: Props) => {
  const isTakingOneStep = (age: Age, currentAge: Age) => {
    const ages: Array<Age> = [ 'I', 'II', 'III' ];

    const ageIndex = ages.findIndex((el) => el === age);
    const currentAgeIndex = ages.findIndex((el) => el === currentAge);

    return currentAgeIndex + 1 === ageIndex;
  };

  const handleClick = (age: Age) => {
    if (isTakingOneStep(age, props.age)) {
      props.onChange(age);
    }
  };

  return (
    <ul className="age-progress">
      <AgeDot age="I" currentAge={props.age} onClick={handleClick} />
      <AgeDot age="II" currentAge={props.age} onClick={handleClick} />
      <AgeDot age="III" currentAge={props.age} onClick={handleClick} />
    </ul>
  );
};
