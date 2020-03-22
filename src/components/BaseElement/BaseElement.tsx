import React from 'react';
import Draggable from 'react-draggable';
import { Position } from '../../types';
import './BaseElement.scss'

interface Props {
  id: number;
  position: Position;
  onMoveStop(index: number, position: Position): void;
  onDoubleClick(index: number): void;
  children: JSX.Element | Array<JSX.Element>;
}

export const BaseElement = (props: Props) => {
  return (
    <Draggable 
      bounds="#draggingarea"
      position={{x: props.position.x, y: props.position.y}}
      onStop={(e, data) => props.onMoveStop(props.id, { x: data.x, y: data.y })}
    >
      <div className="base-element" onDoubleClick={() => props.onDoubleClick(props.id)}>
        {props.children}
      </div>
    </Draggable>
  )
};