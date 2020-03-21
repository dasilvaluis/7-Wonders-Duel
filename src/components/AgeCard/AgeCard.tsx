import React from "react";
import { Position, GameElement } from '../../types';
import { BaseElement } from "../BaseElement/BaseElement";
import './AgeCard.scss';

interface Props {
  x: number;
  y: number;
  card: GameElement;
  index: number;
  onMoveStop(index: number, position: Position): void;
}

export const AgeCard = (props: Props) => (
  <BaseElement
    id={props.index}
    position={{x: props.x, y: props.y}}
    onMoveStop={props.onMoveStop}
  >
    <div className={`agecard -${props.card.type}`}>
      <span>{props.card.name}</span>
    </div>
  </BaseElement>
);
