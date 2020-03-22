import React from "react";
import { Position, GameElement } from '../../types';
import { BaseElement } from '../BaseElement/BaseElement';
import './WonderCard.scss';

interface Props {
  card: GameElement;
  index: number;
  onMoveStop(index: number, position: Position): void;
  onDoubleClick(index: number): void;
}

export const WonderCard = (props: Props) => (
  <BaseElement
    id={props.index}
    position={{x: props.card.x, y: props.card.y}}
    onMoveStop={props.onMoveStop}
    onDoubleClick={props.onDoubleClick}
  >
    <div className={`wondercard ${props.card.faceDown ? '-facedown' : '-faceup'}`}>
      <span>{props.card.name}</span>
    </div>
  </BaseElement>
);
