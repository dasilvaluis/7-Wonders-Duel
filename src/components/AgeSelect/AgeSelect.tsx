import React from 'react';
import './AgeSelect.scss';

interface Props {
  value: string;
  onChange(value: 'I' | 'II' | 'III'): void;
}

export default (props: Props) => {
  const handleChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <select className="select" name="age-selection" value={props.value} onChange={handleChange}>
      <option value="I">I</option>
      <option value="II">II</option>
      <option value="III">III</option>
    </select>
  );
};
