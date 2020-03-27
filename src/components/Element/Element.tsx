import React, { useState } from "react";
import Draggable from "react-draggable";
import { Position, GameElement } from '../../types';
import './Element.scss';
import { getElementStyles } from "../../utils";

interface Props {
  element: GameElement;
  enableDrag?: boolean
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
  enableDrag,
  ...props
}: Props) => {

  const [ dragging, setDragging ] = useState<boolean>(false);

  const handleStart = (e, data) => {
    setDragging(true);
    onStart && onStart(element.id, { x: data.x, y: data.y });
  };

  const handleStop = (e, data) => {
    setDragging(false);
    onStop && onStop(element.id, { x: data.x, y: data.y })
  };

  const handleDrag = (e, data) => {
    onDrag && onDrag(element.id, { x: data.x, y: data.y })
  };

  const elementStyle = {
    ...getElementStyles(element.type),
    backgroundImage: !element.faceDown
      ? element.imageFile ? `url(${ require(`../../data/images/${ element.imageFile }`) })` : ''
      : element.imageFileBackface ? `url(${ require(`../../data/images/${ element.imageFileBackface }`) })` : ''
  }

  return (
    <Draggable 
      bounds="#draggingarea"
      position={{x: element.x, y: element.y}}
      onStart={handleStart}
      onStop={handleStop}
      onDrag={handleDrag}
    >
      <div className="element-container">
        <div
          { ...props }
          className={`element -${ element.type } ${ dragging ? '-dragging' : ''}`} 
          onDoubleClick={() => onDoubleClick && onDoubleClick(element.id)}
          style={elementStyle}
        />
      </div>
    </Draggable>
  );
};
