import React from "react";
import { Position, GameElement } from '../../types';
import { BaseElement } from '../BaseElement/BaseElement';
import './WonderCard.scss';

interface Props {
  x: number;
  y: number;
  card: GameElement;
  index: number;
  onMoveStop(index: number, position: Position): void;
}

export const WonderCard = (props: Props) => (
  <BaseElement
    id={props.index}
    position={{x: props.x, y: props.y}}
    onMoveStop={props.onMoveStop}
  >
    <div className="wondercard">
      <span>{props.card.name}</span>
    </div>
  </BaseElement>
);
