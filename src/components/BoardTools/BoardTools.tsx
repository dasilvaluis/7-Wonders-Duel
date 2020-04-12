import React, { useState } from 'react';
import AgeSelect from '../AgeSelect/AgeSelect';
import { Age } from '../../types';
import './BoardTools.scss';
import '../../styles/helpers.scss';

interface Props {
  onStart(): void;
  onClear(): void;
  onDealBuildings(age: Age): void;
}

export default (props: Props) => {
  const [ age, setAge ] = useState<Age>('I');
  
  const handleStart = () => {
    setAge('I');
    props.onStart();
  };

  return (
    <div className="board-tools">
      <div className="board-tools__column">
        <button className="board-tools__tool" onClick={handleStart}>Start Game</button>
          <hr />
          <div className="board-tools__tool -no-shadow">
            <AgeSelect value={age} onChange={setAge}/>
          </div>
          <button className="board-tools__tool" onClick={() => props.onDealBuildings(age)}>Deal Buildings</button>
      </div>
    </div>
  );
};
