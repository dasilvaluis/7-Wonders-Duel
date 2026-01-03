import React, { useState } from 'react';
import type { DraggableEvent } from 'react-draggable';
import { connect } from 'react-redux';
import {
  addElements,
  bringElement,
  flipElement,
  moveElement,
  setElements,
} from '../../actions/elements-actions';
import { selectElement, unselectElements } from '../../actions/selected-elements-actions';
import AgeProgress from '../../components/AgeProgress';
import Element from '../../components/Element';
import ScorePadModal from '../../components/ScorePadModal';
import type { AppState } from '../../reducers/reducers';
import { getElements, getSelectedElements } from '../../reducers/selectors';
import '../../styles/helpers.scss';
import {
  GameElements,
  type Age,
  type Coordinates,
  type DraggedData,
  type ElementsMap,
  type GameElement,
} from '../../types';
import { generateBoardElement } from '../../utils/board';
import { generateBuildingCards } from '../../utils/buildingCards';
import { useWebSocketContext } from '../WebSocketProvider/WebSocketProvider';
import './board-tools.scss';
import './board.scss';

type StateProps = {
  selectedElements: ElementsMap;
  coins: Array<GameElement>;
  buildingCards: Array<GameElement>;
  wonderCards: Array<GameElement>;
  progressTokens: Array<GameElement>;
  militaryTokens: Array<GameElement>;
  conflictPawn: GameElement | null;
};

type DispatchProps = {
  onSetElements(elements: Array<GameElement>): void;
  onAddElements(elements: Array<GameElement>): void;
  onMoveElement(elementId: string, position: Coordinates): void;
  onFlipElement(elementId: string): void;
  onBringElement(elementId: string, direction: string): void;
  onSelectElement(elementId: string, selected: boolean): void;
  onUnselectElements(): void;
};

type Props = StateProps & DispatchProps;

const Board = (props: Props) => {
  const [visibleScorePad, setVisibleScorePad] = useState<boolean>(false);
  const wsContext = useWebSocketContext();

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, elementId: string) => {
    const isSelected = !!props.selectedElements[elementId];

    if (e.shiftKey) {
      props.onSelectElement(elementId, true);
    } else if (!isSelected) {
      props.onUnselectElements();
    }
  };

  const handleMoveElement = (_event: DraggableEvent, data: DraggedData, elementId: string) => {
    const delta = {
      x: data.deltaX,
      y: data.deltaY,
    };

    const elementsIds = !!props.selectedElements[elementId]
      ? Object.keys(props.selectedElements)
      : [elementId];

    wsContext?.moveElement(elementsIds, delta);
    elementsIds.forEach((id) => {
      props.onMoveElement(id, delta);
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

      props.onBringElement(elementId, direction);
      wsContext?.bringElement(elementId, direction);
    } else {
      props.onFlipElement(elementId);
      wsContext?.flipElement(elementId);
    }

    props.onUnselectElements();
  };

  const handleBoardClick = ({ target }: React.MouseEvent) => {
    if (!(target as Element).classList.contains('element')) {
      props.onUnselectElements();
    }
  };

  const handleChangeAge = (age: Age) => {
    const cards = generateBuildingCards(age);

    wsContext?.changeAge(age);
    wsContext?.addElements(cards);
    props.onAddElements(cards);
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
        {props.militaryTokens.map((el) => (
          <Element
            key={el.id}
            element={el}
            onMove={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
          />
        ))}
        {props.progressTokens.map((el) => (
          <Element
            key={el.id}
            element={el}
            selected={!!props.selectedElements[el.id]}
            onMove={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
          />
        ))}
        {props.conflictPawn && (
          <Element
            key={props.conflictPawn.id}
            element={props.conflictPawn}
            onMove={handleMoveElement}
            onDoubleClick={(e) => handleDoubleClickElement(e, props.conflictPawn!.id)}
          />
        )}
        {props.buildingCards.map((el) => (
          <Element
            key={el.id}
            element={el}
            selected={!!props.selectedElements[el.id]}
            onMove={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
          />
        ))}
        {props.wonderCards.map((el) => (
          <Element
            key={el.id}
            element={el}
            selected={!!props.selectedElements[el.id]}
            onMove={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
          />
        ))}
        {props.coins.map((el) => (
          <Element
            key={el.id}
            element={el}
            selected={!!props.selectedElements[el.id]}
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

const mapStateToProps = (state: AppState): StateProps => ({
  selectedElements: getSelectedElements(state),
  conflictPawn: getElements(state, GameElements.CONFLICT_PAWN)[0],
  coins: [
    ...getElements(state, GameElements.COIN_6),
    ...getElements(state, GameElements.COIN_3),
    ...getElements(state, GameElements.COIN_1),
  ],
  militaryTokens: [
    ...getElements(state, GameElements.MILITARY_TOKEN_5),
    ...getElements(state, GameElements.MILITARY_TOKEN_2),
  ],
  progressTokens: getElements(state, GameElements.PROGRESS_TOKEN),
  buildingCards: getElements(state, GameElements.BUILDING_CARD),
  wonderCards: getElements(state, GameElements.WONDER_CARD),
});

const mapDispatchToProps: DispatchProps = {
  onSetElements: (elements) => setElements(elements),
  onAddElements: (elements) => addElements(elements),
  onMoveElement: (elementId, position) => moveElement(elementId, position),
  onFlipElement: (elementId) => flipElement(elementId),
  onBringElement: (elementId, direction) => bringElement(elementId, direction),
  onSelectElement: (elementId, selected) => selectElement(elementId, selected),
  onUnselectElements: () => unselectElements(),
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
