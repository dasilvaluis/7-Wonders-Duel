import React from "react";
import Draggable from "react-draggable";
import { Position, GameElement } from '../../types';
import './Element.scss';

interface Props {
  element: GameElement;
  onDrag(id: string, position: Position): void;
  onDoubleClick(id: string): void;
  [ key: string ]: any;
}

export default ({
  element,
  onDrag,
  onDoubleClick,
  ...props
}: Props) => (
  <Draggable 
    bounds="#draggingarea"
    position={{x: element.x, y: element.y}}
    onDrag={(e, data) => onDrag && onDrag(element.id, { x: data.x, y: data.y })}
  >
    <div
      { ...props }
      className={`element -${ element.type }`} 
      onDoubleClick={() => onDoubleClick(element.id)}
      style={
        !element.faceDown 
          ? { backgroundImage: element.imageFile ? `url(${ require(`../../data/images/${ element.imageFile }`) })` : ''}
          : { backgroundImage: element.imageFileBackface ? `url(${ require(`../../data/images/${ element.imageFileBackface }`) })` : ''}
      }
    />
  </Draggable>
);
