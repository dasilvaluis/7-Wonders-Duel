import React from "react";
import Draggable from "react-draggable";
import { AgeCard as AgeCardInterface } from "../../reducers/cards-reducer";
import './AgeCard.scss';

interface Props {
  x: number;
  y: number;
  card: AgeCardInterface;
}

export const AgeCard = (props: Props) => {
  return (
    <Draggable 
      bounds="#draggingarea"
      position={{x: props.x, y: props.y}}
    >
      <div className={`card -${props.card.type}`}>
        <span>{props.card.name}</span>
      </div>
    </Draggable>
  )
};