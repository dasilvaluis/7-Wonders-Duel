import React, { useState } from 'react';
import AgeSelect from '../AgeSelect/AgeSelect';
import { Age } from '../../types';
import './BoardTools.scss';
import '../../styles/helpers.scss';

interface Props {
  onStart(): void;
  onDealBuildings(age: Age): void;
}

export default (props: Props) => (
  <div className="board-tools">
    <button className="board-tools__tool" onClick={props.onStart}>Start Game</button>
  </div>
);
