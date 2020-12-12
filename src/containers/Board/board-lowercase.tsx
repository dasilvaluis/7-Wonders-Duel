import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { DraggableEvent } from 'react-draggable';
import {
  Coordinates, GameElement, ElementTypes, Age, DraggedData, ElementsMap
} from '../../types';
import { getElements, getSelectedElements } from '../../reducers/selectors';
import { setElements, flipElement, addElements, bringElement, moveElement } from '../../actions/elements-actions';
import { AppState } from '../../reducers/reducers';
import { generateBuildingCards } from '../../utils/buildingcards-utils';
import { generateBoardElement } from '../../utils/board-utils';
import Element from '../../components/Element';
import { selectElement, unselectElements } from '../../actions/selected-elements-actions';
import AgeProgress from '../../components/AgeProgress';
import ScorePadModal from '../../components/ScorePadModal';
import { WebSocketContext } from '../WebSocketProvider/websocket-provider';
import './board-lowercase.scss';
import './board-tools.scss';
import '../../styles/helpers.scss';

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
  const [ visibleScorePad, setVisibleScorePad ] = useState<boolean>(false);
  const wsContext = useContext(WebSocketContext);

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
      y: data.deltaY
    };

    const elementsIds = !!props.selectedElements[elementId]
      ? Object.keys(props.selectedElements)
      : [ elementId ];

    wsContext?.moveElement(elementsIds, delta);
    elementsIds.forEach((id) => {
      props.onMoveElement(id, delta);
    });
  };

  const handleDoubleClickElement = (e: React.MouseEvent, elementId: string) => {
    if (e.shiftKey) {
      const direction = e.getModifierState('CapsLock') 
        ? !e.altKey ? 'forward' : 'backward'
        : !e.altKey ? 'front' : 'back';

      props.onBringElement(elementId, direction);
      wsContext?.bringElement(elementId, direction);
    } else {
      props.onFlipElement(elementId);
      wsContext?.flipElement(elementId)
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
  }

  return (
    <div id="draggingarea" className="board" onClick={ handleBoardClick }>
      <div className="board__players" />
      <div className="board-tools">
        <button className="board-tools__button" onClick={ wsContext?.startGame }>Start Game</button>
        <button className="board-tools__button" onClick={ () => setVisibleScorePad(true) }>Count Points</button>
      </div>
      <div className="board__age-progress-container">
        <AgeProgress age={ wsContext?.age } onChange={ handleChangeAge } />
      </div>
      <div className="board__elements">
        <Element element={ generateBoardElement() }/>
        { props.militaryTokens.map((el) =>
          <Element key={ el.id }
            element={ el }
            onMove={ handleMoveElement }
            onMouseDown={ (e) => handleMouseDown(e, el.id) }
            onDoubleClick={ (e) => handleDoubleClickElement(e, el.id) } />
        ) }
        { props.progressTokens.map((el) =>
          <Element key={ el.id }
            element={ el }
            selected={ !!props.selectedElements[el.id] }
            onMove={ handleMoveElement }
            onMouseDown={ (e) => handleMouseDown(e, el.id) }
            onDoubleClick={ (e) => handleDoubleClickElement(e, el.id) } />
        ) }
        { props.conflictPawn && 
          <Element key={props.conflictPawn.id}
            element={ props.conflictPawn }
            onMove={ handleMoveElement }
            onDoubleClick={ (e) => handleDoubleClickElement(e, props.conflictPawn.id) } />
        }
        { props.buildingCards.map((el) =>
          <Element key={ el.id }
            element={ el }
            selected={ !!props.selectedElements[el.id] }
            onMove={ handleMoveElement }
            onMouseDown={ (e) => handleMouseDown(e, el.id) }
            onDoubleClick={ (e) => handleDoubleClickElement(e, el.id) } />
        ) }
        { props.wonderCards.map((el) =>
          <Element key={ el.id }
            element={ el }
            selected={ !!props.selectedElements[el.id] }
            onMove={ handleMoveElement }
            onMouseDown={ (e) => handleMouseDown(e, el.id) }
            onDoubleClick={ (e) => handleDoubleClickElement(e, el.id) } />
        ) }
        { props.coins.map((el) =>
          <Element key={ el.id }
            element={ el }
            selected={ !!props.selectedElements[el.id] }
            onMove={ handleMoveElement }
            onMouseDown={ (e) => handleMouseDown(e, el.id) }
            onDoubleClick={ (e) => handleDoubleClickElement(e, el.id) } />
        ) }
      </div>
      <ScorePadModal open={ visibleScorePad } onClose={ () => setVisibleScorePad(false) } />
    </div>
  )
};

const mapStateToProps = (state: AppState): StateProps => ({
  selectedElements: getSelectedElements(state),
  conflictPawn: getElements(state, ElementTypes.CONFLICT_PAWN)[0],
  coins: [ 
    ...getElements(state, ElementTypes.COIN_6),
    ...getElements(state, ElementTypes.COIN_3),
    ...getElements(state, ElementTypes.COIN_1)
  ],
  militaryTokens: [
    ...getElements(state, ElementTypes.MILITARY_TOKEN_5),
    ...getElements(state, ElementTypes.MILITARY_TOKEN_2)
  ],
  progressTokens: getElements(state, ElementTypes.PROGRESS_TOKEN),
  buildingCards: getElements(state, ElementTypes.BUILDING_CARD),
  wonderCards: getElements(state, ElementTypes.WONDER_CARD)
});

const mapDispatchToProps: DispatchProps = {
  onSetElements: (elements) => setElements(elements),
  onAddElements: (elements) => addElements(elements),
  onMoveElement: (elementId, position) => moveElement(elementId, position),
  onFlipElement: (elementId) => flipElement(elementId),
  onBringElement: (elementId, direction) => bringElement(elementId, direction),
  onSelectElement: (elementId, selected) => selectElement(elementId, selected),
  onUnselectElements: () => unselectElements()
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
