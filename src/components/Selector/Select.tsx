import React from 'react';
import './Select.scss';

interface Props {
  value: string;
  onChange(value: string): void;
}

export default (props: Props) => {
  const handleChange = (event) => {
    props.onChange(event.target.value);
  };

  return (
    <select className="select" name="difficulty-selection" value={props.value} onChange={handleChange}>
      <option value="1">I</option>
      <option value="2">II</option>
      <option value="3">III</option>
    </select>
  );
};
