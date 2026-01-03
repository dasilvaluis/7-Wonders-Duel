import cn from 'classnames';
import React, { useState } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { type DraggedData, type GameElement } from '../../types';
import { getElementStyles } from '../../utils/utils';
import './element.scss';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  element: GameElement;
  selected?: boolean;
  onMove?(event: DraggableEvent, data: DraggedData, id: string): void;
  onStartMove?(event: DraggableEvent, data: DraggedData, id: string): void;
  onStopMove?(event: DraggableEvent, data: DraggedData, id: string): void;
}

const getImageUrl = (imageFile: string) => `url(/images/${imageFile})`;

export default ({
  element,
  onMove = () => {},
  onStartMove = () => {},
  onStopMove = () => {},
  selected,
  ...props
}: Props) => {
  const [ dragging, setDragging ] = useState(false);

  const handleStart = (
    e: DraggableEvent,
    data: DraggableData
  ) => {
    setDragging(true);
    onStartMove(e, { ...data }, element.id);
  };

  const handleStop = (
    e: DraggableEvent,
    data: DraggableData
  ) => {
    setDragging(false);
    onStopMove(e, { ...data }, element.id)
  };

  const handleDrag = (
    e: DraggableEvent,
    data: DraggableData
  ) => {
    onMove(e, { ...data }, element.id);
  };


  const elementStyle = {
    ...getElementStyles(element.type),
    backgroundImage: !element.faceDown
      ? element.imageFile ? getImageUrl(element.imageFile) : ''
      : element.imageFileBackface ? getImageUrl(element.imageFileBackface) : ''
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
      position={ {x: element.x, y: element.y} }
      onStart={ handleStart }
      onStop={ handleStop }
      onDrag={ handleDrag }
    >
      <div className="element-container">
        <div { ...props }
          className={ elementClasses }
          style={ elementStyle }
        />
      </div>
    </Draggable>
  );
};
