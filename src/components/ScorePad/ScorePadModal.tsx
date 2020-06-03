import Modal from '../Modal';
import React, { useState } from 'react';
import ScorePad from './ScorePad';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import { Coordinates, ElementTypes } from '../../types';
import { BOARD_WIDTH, ELEMENT_MARGIN } from '../../contants';
import { getElementSize } from '../../utils';
import cn from 'classnames';

interface Props {
  open: boolean;
  onClose(): void;
}

export default ({
  open,
  onClose
}: Props) => {
  const [ dragging, setDragging ] = useState<boolean>(false);
  const [ { x, y }, setPosition ] = useState<Coordinates>({
    x: (BOARD_WIDTH - 400) / 2,
    y: getElementSize(ElementTypes.BOARD).height + ELEMENT_MARGIN
  });

  const handleDrag = (
    e: DraggableEvent,
    data: DraggableData
  ) => {
    setPosition({ x: data.x, y: data.y })
  };

  const handleStart = () => {
    setDragging(true);
  };

  const handleStop = () => {
    setDragging(false);
  };

  return (
    <Draggable 
      bounds="#draggingarea"
      position={{ x, y }}
      onStart={handleStart}
      onStop={handleStop}
      onDrag={handleDrag}
      enableUserSelectHack={false}
    >
      <div className={cn(
        'score-pad__modal-container',
        { '-dragging': dragging }
      )}>
        <Modal open={open} onClose={onClose} noPosition={true}>
          <ScorePad />
        </Modal>
      </div>
    </Draggable>
  );  
};
