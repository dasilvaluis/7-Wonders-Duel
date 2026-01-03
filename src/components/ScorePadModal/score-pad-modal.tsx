import cn from 'classnames';
import { useState } from 'react';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import { BOARD_WIDTH, ELEMENT_MARGIN } from '../../constants';
import { type Coordinates, GameElements } from '../../types';
import { getElementSize } from '../../utils/utils';
import Modal from '../Modal';
import ScorePad from './score-pad';

type Props = {
  open: boolean;
  onClose(): void;
};

export default ({
  open,
  onClose
}: Props) => {
  const [ dragging, setDragging ] = useState<boolean>(false);
  const [ { x, y }, setPosition ] = useState<Coordinates>({
    x: (BOARD_WIDTH - 400) / 2,
    y: getElementSize(GameElements.BOARD).height + ELEMENT_MARGIN
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
