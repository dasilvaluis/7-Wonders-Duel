import React, { useState } from 'react';
import type { DraggableEvent } from 'react-draggable';
import { connect, useDispatch } from 'react-redux';
import AgeProgress from '../../components/AgeProgress';
import Element from '../../components/Element';
import ScorePadModal from '../../components/ScorePadModal';
import { elementsActions } from '../../reducers/elements-reducer';
import type { AppState } from '../../reducers/reducers';
import { selectedElementsActions } from '../../reducers/selected-elements-reducer';
import { getElements, getSelectedElements } from '../../reducers/selectors';
import '../../styles/helpers.scss';
import { GameElements, type Age, type DraggedData, type ElementsMap, type GameElement } from '../../types';
import { generateBoardElement } from '../../utils/board';
import { generateBuildingCards } from '../../utils/buildingCards';
import { useWebSocketContext } from '../WebSocketProvider/WebSocketProvider';
import './board-tools.scss';
import './board.scss';

export const Board = () => {
  const [visibleScorePad, setVisibleScorePad] = useState<boolean>(false);
  const wsContext = useWebSocketContext();
  const dispatch = useDispatch();

  const selectedElements = useSelector(pickSelectedElements);
  const conflictPawn = useSelector(selectConflictPawn);
  const coins = useSelector(selectCoins);
  const militaryTokens = useSelector(selectMilitaryTokens);
  const progressTokens = useSelector(selectProgressTokens);
  const buildingCards = useSelector(selectBuildingCards);
  const wonderCards = useSelector(selectWonderCards);

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
    if (e.shiftKey) {
      const direction = e.getModifierState('CapsLock')
        ? !e.altKey
          ? 'forward'
          : 'backward'
        : !e.altKey
          ? 'front'
          : 'back';

      dispatch(elementsActions.bringElement({ id: elementId, direction }));
      wsContext?.bringElement(elementId, direction);
    } else {
      dispatch(elementsActions.flipElement({ id: elementId }));
      wsContext?.flipElement(elementId);
    }

    dispatch(selectedElementsActions.unselectElements());
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
        <Element element={generateBoardElement()} />
        {militaryTokens.map((el) => (
          <Element
            key={el.id}
            element={el}
            onMove={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
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
          />
        ))}
        {conflictPawn && (
          <Element
            key={conflictPawn.id}
            element={conflictPawn}
            onMove={handleMoveElement}
            onDoubleClick={(e) => handleDoubleClickElement(e, conflictPawn.id)}
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
          />
        ))}
      </div>
      <ScorePadModal open={visibleScorePad} onClose={() => setVisibleScorePad(false)} />
    </div>
  );
};
