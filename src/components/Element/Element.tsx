import React, { useState } from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { GameElement, DraggedData } from '../../types';
import './Element.scss';
import { getElementStyles } from "../../utils";
import cn from 'classnames';

interface Props {
  element: GameElement;
  selected?: boolean;
  enableDrag?: boolean
  onDrag?(event: DraggableEvent, data: DraggedData, id: string): void;
  onStartDrag?(event: DraggableEvent, data: DraggedData, id: string): void;
  onStopDrag?(event: DraggableEvent, data: DraggedData, id: string): void;
  [ key: string ]: any;
}

export default ({
  element,
  onStartDrag,
  onStopDrag,
  onDrag,
  enableDrag,
  selected,
  ...props
}: Props) => {
  const [ dragging, setDragging ] = useState<boolean>(false);

  const handleStart = (
    e: DraggableEvent,
    data: DraggableData
  ) => {
    setDragging(true);
    onStartDrag && onStartDrag(e, { ...data }, element.id);
  };

  const handleStop = (
    e: DraggableEvent,
    data: DraggableData
  ) => {
    setDragging(false);
    onStopDrag && onStopDrag(e, { ...data }, element.id)
  };

  const handleDrag = (
    e: DraggableEvent,
    data: DraggableData
  ) => {
    onDrag && onDrag(e, { ...data }, element.id);
  };

  const elementStyle = {
    ...getElementStyles(element.type),
    backgroundImage: !element.faceDown
      ? element.imageFile ? `url(${ require(`../../images/${ element.imageFile }`) })` : ''
      : element.imageFileBackface ? `url(${ require(`../../images/${ element.imageFileBackface }`) })` : ''
  }

  const elementClasses = cn(
    'element',
    `-${ element.type }`,
    { '-dragging': dragging },
    { '-selected': selected }
  );

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
          className={elementClasses}
          style={elementStyle}
        />
      </div>
    </Draggable>
  );
};
