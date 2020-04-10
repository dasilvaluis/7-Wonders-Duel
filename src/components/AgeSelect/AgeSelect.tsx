import React from 'react';
import { Age } from '../../types';
import './AgeSelect.scss';

interface Props {
  value: string;
  onChange(value: Age): void;
}

export default (props: Props) => {
  const handleChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <label className="age-select" htmlFor="age-selection">
      Age:
      <select className="select" name="age-selection" value={props.value} onChange={handleChange}>
        <option value="I">I</option>
        <option value="II">II</option>
        <option value="III">III</option>
      </select>
    </label>
  );
};
