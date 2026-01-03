import React, { useRef, useState } from 'react';
import type { DraggableEvent } from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import { AgeProgress } from '../../components/AgeProgress/age-progress';
import { Element } from '../../components/Element/element';
import { ScorePadModal } from '../../components/ScorePadModal/score-pad-modal';
import { elementsActions } from '../../state/elementsSlice';
import { selectedElementsActions } from '../../state/selectedElementsSlice';
import {
  pickSelectedElements,
  selectBuildingCards,
  selectCoins,
  selectConflictPawn,
  selectMilitaryTokens,
  selectProgressTokens,
  selectWonderCards,
} from '../../state/selectors';
import '../../styles/helpers.scss';
import { VerticalDirections, type Age, type DraggedData } from '../../types';
import { boardElement } from '../../utils/board';
import { generateBuildingCards } from '../../utils/buildingCards';
import { useWebSocketContext } from '../WebSocketProvider/WebSocketProvider';
import './board-tools.scss';
import './board.scss';

export const Board = () => {
  const [visibleScorePad, setVisibleScorePad] = useState<boolean>(false);
  const wsContext = useWebSocketContext();
  const dispatch = useDispatch();
  const lastTapRef = useRef<{ time: number; elementId: string | null }>({ time: 0, elementId: null });

  const selectedElements = useSelector(pickSelectedElements);
  const conflictPawn = useSelector(selectConflictPawn);
  const coins = useSelector(selectCoins);
  const militaryTokens = useSelector(selectMilitaryTokens);
  const progressTokens = useSelector(selectProgressTokens);
  const buildingCards = useSelector(selectBuildingCards);
  const wonderCards = useSelector(selectWonderCards);

  const handleDoubleAction = (elementId: string, shiftKey: boolean, altKey: boolean, capsLock: boolean) => {
    if (shiftKey) {
      const direction = capsLock
        ? !altKey
          ? VerticalDirections.FORWARD
          : VerticalDirections.BACKWARD
        : !altKey
          ? VerticalDirections.FRONT
          : VerticalDirections.BACK;

      dispatch(elementsActions.bringElement({ id: elementId, direction }));
      wsContext?.bringElement(elementId, direction);
    } else {
      dispatch(elementsActions.flipElement({ id: elementId }));
      wsContext?.flipElement(elementId);
    }

    dispatch(selectedElementsActions.unselectElements());
  };

  const handleTouchEnd = (e: React.TouchEvent, elementId: string) => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current.time;
    const isSameElement = lastTapRef.current.elementId === elementId;

    if (timeDiff < 300 && isSameElement) {
      e.preventDefault();
      handleDoubleAction(elementId, false, false, false);
    }

    lastTapRef.current = { time: now, elementId };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, elementId: string) => {
    const isSelected = !!selectedElements[elementId];

    if (e.shiftKey) {
      dispatch(selectedElementsActions.selectElement({ id: elementId, selected: true }));
    } else if (!isSelected) {
      dispatch(selectedElementsActions.unselectElements());
    }
  };

  const handleMoveElement = (_event: DraggableEvent, data: DraggedData, elementId: string) => {
    const delta = {
      x: data.deltaX,
      y: data.deltaY,
    };

    const elementsIds = !!selectedElements[elementId] ? Object.keys(selectedElements) : [elementId];

    wsContext?.moveElement(elementsIds, delta);
    elementsIds.forEach((id) => {
      dispatch(elementsActions.moveElement({ id, delta }));
    });
  };

  const handleDoubleClickElement = (e: React.MouseEvent, elementId: string) => {
    handleDoubleAction(elementId, e.shiftKey, e.altKey, e.getModifierState('CapsLock'));
  };

  const handleBoardClick = ({ target }: React.MouseEvent) => {
    if (!(target as Element).classList.contains('element')) {
      dispatch(selectedElementsActions.unselectElements());
    }
  };

  const handleChangeAge = (age: Age) => {
    const cards = generateBuildingCards(age);

    wsContext?.changeAge(age);
    wsContext?.addElements(cards);
    dispatch(elementsActions.addElements(cards));
  };

  return (
    <div id="draggingarea" className="board" onClick={handleBoardClick}>
      <div className="board__players" />
      <div className="board-tools">
        <button className="board-tools__button" onClick={wsContext?.startGame}>
          Start Game
        </button>
        <button className="board-tools__button" onClick={() => setVisibleScorePad(true)}>
          Count Points
        </button>
      </div>
      <div className="board__age-progress-container">
        <AgeProgress age={wsContext?.age} onChange={handleChangeAge} />
      </div>
      <div className="board__elements">
        <Element disabled element={boardElement} />
        {militaryTokens.map((el) => (
          <Element
            key={el.id}
            element={el}
            onMove={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
            onTouchEnd={(e) => handleTouchEnd(e, el.id)}
          />
        ))}
        {progressTokens.map((el) => (
          <Element
            key={el.id}
            element={el}
            selected={!!selectedElements[el.id]}
            onMove={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
            onTouchEnd={(e) => handleTouchEnd(e, el.id)}
          />
        ))}
        {conflictPawn && (
          <Element
            key={conflictPawn.id}
            element={conflictPawn}
            onMove={handleMoveElement}
            onDoubleClick={(e) => handleDoubleClickElement(e, conflictPawn.id)}
            onTouchEnd={(e) => handleTouchEnd(e, conflictPawn.id)}
          />
        )}
        {buildingCards.map((el) => (
          <Element
            key={el.id}
            element={el}
            selected={!!selectedElements[el.id]}
            onMove={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
            onTouchEnd={(e) => handleTouchEnd(e, el.id)}
          />
        ))}
        {wonderCards.map((el) => (
          <Element
            key={el.id}
            element={el}
            selected={!!selectedElements[el.id]}
            onMove={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
            onTouchEnd={(e) => handleTouchEnd(e, el.id)}
          />
        ))}
        {coins.map((el) => (
          <Element
            key={el.id}
            element={el}
            selected={!!selectedElements[el.id]}
            onMove={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
            onTouchEnd={(e) => handleTouchEnd(e, el.id)}
          />
        ))}
      </div>
      <ScorePadModal open={visibleScorePad} onClose={() => setVisibleScorePad(false)} />
    </div>
  );
};
