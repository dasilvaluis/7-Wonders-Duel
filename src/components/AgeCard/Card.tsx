import React from "react";
import Draggable from "react-draggable";
import './Card.scss';
import { GameElement } from "../../types";

interface Props {
  initialX: number;
  initialY: number;
  card: GameElement;
}

export const Card = (props: Props) => {
  return (
    <Draggable 
      bounds="#draggingarea"
      defaultPosition={{x: props.initialX, y: props.initialY}}
    >
      <div className={`card -${props.card.type}`}>
        <span>{props.card.name}</span>
      </div>
    </Draggable>
  )
};