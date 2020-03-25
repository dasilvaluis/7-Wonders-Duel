import React from 'react';
import './PlayerArea.scss';

interface OwnProps {
  money: number;
  onSetMoney(value: number): void;
}

interface Props extends OwnProps {}

export default (props: Props) => {
  return (
    <div className="playerarea">
      <div>Money:
        <input
          type="number"
          value={props.money}
          className="playerarea__money-input"
          onChange={(e) => props.onSetMoney(parseInt(e.target.value, 10))}
        />
      </div>
      <div className="playerarea__tokens"></div>
      <div className="playerarea__deck"></div>
    </div>
  )
};
