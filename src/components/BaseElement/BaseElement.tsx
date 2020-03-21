import React from 'react';
import Draggable from 'react-draggable';
import { Position } from '../../types';

interface Props {
  id: number;
  position: Position;
  children: JSX.Element | Array<JSX.Element>;
  onMoveStop(index: number, position: Position): void;
}

export const BaseElement = (props: Props) => {
  return (
    <Draggable 
      bounds="#draggingarea"
      position={{x: props.position.x, y: props.position.y}}
      onStop={(e, data) => props.onMoveStop(props.id, { x: data.x, y: data.y })}
    >
      {props.children}
    </Draggable>
  )
};