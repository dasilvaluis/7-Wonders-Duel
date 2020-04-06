import React from 'react';
import Draggable from 'react-draggable';
import { Coordinates } from '../../types';
import './BaseElement.scss'

interface Props {
  id: string;
  position: Coordinates;
  onDrag?(id: string, position: Coordinates): void;
  onMoveStop?(id: string, position: Coordinates): void;
  onDoubleClick?(id: string): void;
  children: JSX.Element | Array<JSX.Element>;
}

export const BaseElement = (props: Props) => {
  return (
    <Draggable 
      bounds="#draggingarea"
      position={{x: props.position.x, y: props.position.y}}
      onDrag={(e, data) => props.onDrag && props.onDrag(props.id, { x: data.x, y: data.y })}
      onStop={(e, data) => props.onMoveStop && props.onMoveStop(props.id, { x: data.x, y: data.y })}
    >
      <div className="base-element" onDoubleClick={() => props.onDoubleClick(props.id)}>
        {props.children}
      </div>
    </Draggable>
  )
};
