import React from "react";
import { CardInterface } from "../../types";
import Draggable from "react-draggable";
import './Card.scss';

interface Props {
  initialX: number;
  initialY: number;
  card: CardInterface;
}

export const Card = (props: Props) => {
  return (
    <Draggable 
      bounds=".board"
      defaultPosition={{x: props.initialX, y: props.initialY}}
    >
      <div className={`card -${props.card.type}`}>
        <span>{props.card.name}</span>
      </div>
    </Draggable>
  )
};