import React from "react";
import Draggable from "react-draggable";
import { AgeCard as AgeCardInterface } from "../../reducers/cards-reducer";
import { Position } from '../../types';
import './AgeCard.scss';

interface Props {
  x: number;
  y: number;
  card: AgeCardInterface;
  index: number;
  onMoveStop(index: number, position: Position): void;
}

export const AgeCard = (props: Props) => {
  return (
    <Draggable 
      bounds="#draggingarea"
      position={{x: props.x, y: props.y}}
      onStop={(e, data) => props.onMoveStop(props.index, { x: data.x, y: data.y })}
    >
      <div className={`card -${props.card.type}`}>
        <span>{props.card.name}</span>
      </div>
    </Draggable>
  )
};