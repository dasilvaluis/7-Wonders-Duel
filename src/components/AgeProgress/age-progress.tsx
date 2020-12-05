import React from 'react';
import { Age } from '../../types';
import AgeDot from './age-dot';
import './age-progress.scss';

interface Props {
  age: Age | null;
  onChange(age: Age): void;
}

const ages: Array<Age> = [ 'I', 'II', 'III' ];

export default (props: Props) => (
  <ul className="age-progress">
    {ages.map((age) => <AgeDot age={age} currentAge={props.age} onClick={props.onChange} key={age} />)}
  </ul>
);
