import React, { useState } from "react";
import Draggable from "react-draggable";
import { Position, GameElement } from '../../types';
import './Element.scss';

interface Props {
  element: GameElement;
  onDrag?(id: string, position: Position): void;
  onStart?(id: string, position: Position): void;
  onStop?(id: string, position: Position): void;
  onDoubleClick?(id: string): void;
  [ key: string ]: any;
}

export default ({
  element,
  onStart,
  onStop,
  onDrag,
  onDoubleClick,
  ...props
}: Props) => {

  const [ dragging, setDragging ] = useState<boolean>(false);

  const handleStart = (e, data) => {
    setDragging(true);
    onStart && onStart(element.id, { x: data.x, y: data.y })
  };

  const handleStop = (e, data) => {
    setDragging(false);
    onStop && onStop(element.id, { x: data.x, y: data.y })
  };

  const handleDrag = (e, data) => {
    onDrag && onDrag(element.id, { x: data.x, y: data.y })
  };

  return (
    <Draggable 
      bounds="#draggingarea"
      position={{x: element.x, y: element.y}}
      onStart={handleStart}
      onStop={handleStop}
      onDrag={handleDrag}
    >
      <div
        { ...props }
        className={`element -${ element.type } ${ dragging ? '-dragging' : ''}`} 
        onDoubleClick={() => onDoubleClick && onDoubleClick(element.id)}
        style={
          !element.faceDown 
            ? { backgroundImage: element.imageFile ? `url(${ require(`../../data/images/${ element.imageFile }`) })` : ''}
            : { backgroundImage: element.imageFileBackface ? `url(${ require(`../../data/images/${ element.imageFileBackface }`) })` : ''}
        }
      />
    </Draggable>
  );
};
