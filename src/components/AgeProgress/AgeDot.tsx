import React from 'react';
import { Age } from '../../types';

interface Props {
  age: Age;
  currentAge: Age | null;
  onClick(age: Age): void;
}

const isActive = (age: Age, currentAge: Age) => {
  const ages: Array<Age> = [ 'I', 'II', 'III' ];

  const ageIndex = ages.findIndex((el) => el === age);
  const currentAgeIndex = ages.findIndex((el) => el === currentAge);

  return ageIndex <= currentAgeIndex;
};

export default (props: Props) => 
  <li 
    data-age={ props.age }
    className={`age-progress__button ${ props.age && isActive(props.age, props.currentAge) ? '-active' : '' }`}
    onClick={() => props.onClick(props.age)}
  />;