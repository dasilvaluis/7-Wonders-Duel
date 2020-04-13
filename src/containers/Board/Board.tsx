import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  GET_ELEMENTS, SET_ELEMENTS, BRING_ELEMENT, ADD_ELEMENTS, FLIP_ELEMENT, MOVE_ELEMENT, SET_AGE, GET_AGE
} from '../../contants';
import {
  Coordinates, GameElement, ElementTypes, Age, MoveElementAPIEvent, FlipElementAPIEvent, 
  AddElementsAPIEvent, SetElementsAPIEvent, BringElementAPIEvent, DraggedData, ElementsMap, SetAgeAPIEvent
} from '../../types';
import { getElements, getElementOfType, getSelectedElements } from '../../reducers/selectors';
import { setElements, flipElement, addElements, bringElement, moveElement } from '../../actions/elements-actions';
import { AppState } from '../../reducers/reducers';
import { getBuildingCards } from './buildingcards-utils';
import { getWonderCards } from './wondercards-utils';
import { getBoardElement, getProgressTokens, getMilitaryTokens, getConflictPawn } from './board-utils';
import { getCoins } from './coins-utils';
import Element from '../../components/Element/Element';
import { socket }  from '../../client';
import { selectElement, unselectElements } from '../../actions/selected-elements-actions';
import { DraggableEvent } from 'react-draggable';
import './Board.scss';
import '../../styles/helpers.scss';
import BoardTools from '../../components/BoardTools/BoardTools';
import AgeProgress from '../../components/AgeProgress/AgeProgress';

interface StateProps {
  selectedElements: ElementsMap;
  coins: Array<GameElement>;
  buildingCards: Array<GameElement>;
  wonderCards: Array<GameElement>;
  progressTokens: Array<GameElement>;
  militaryTokens: Array<GameElement>;
  conflictPawn: GameElement | null;
}

interface DispatchProps {
  onSetElements(elements: Array<GameElement>): void;
  onAddElements(elements: Array<GameElement>): void;
  onMoveElement(elementId: string, position: Coordinates): void;
  onFlipElement(elementId: string): void;
  onBringElement(elementId: string, direction: string): void;
  onSelectElement(elementId: string, selected: boolean): void;
  onUnselectElements(): void;
}

interface Props extends StateProps, DispatchProps {};

const Board = (props: Props) => {
  const [ age, setAge ] = useState<Age | null>(null);

  useEffect(() => {
    socket.on(SET_ELEMENTS, (data: SetElementsAPIEvent) => {
      props.onSetElements(data);
    });

    socket.on(MOVE_ELEMENT, (data: MoveElementAPIEvent) => {
      const { elementsIds, delta } = data;

      elementsIds.forEach((id) => {
        props.onMoveElement(id, delta);
      });
    });

    socket.on(ADD_ELEMENTS, (data: AddElementsAPIEvent) => {
      props.onAddElements(data);
    });

    socket.on(FLIP_ELEMENT, (data: FlipElementAPIEvent) => {
      props.onFlipElement(data.elementId);
    });

    socket.on(BRING_ELEMENT, (data: BringElementAPIEvent) => {
      props.onBringElement(data.elementId, data.direction);
    });
    
    socket.on(SET_AGE, (data: SetAgeAPIEvent) => {
      setAge(data.age);
    });
  }, []);
  
  useEffect(() => {
    if (socket.hasListeners(GET_ELEMENTS) ) {
      socket.off(GET_ELEMENTS);
    }

    if (socket.hasListeners(GET_AGE) ) {
      socket.off(GET_AGE);
    }

    const elements: Array<GameElement> = [
      ...props.coins,
      ...props.buildingCards,
      ...props.wonderCards,
      ...props.progressTokens,
      ...props.militaryTokens
    ];

    if (props.conflictPawn !== null) {
      elements.push(props.conflictPawn);
    }

    socket.on(GET_ELEMENTS, () => {
      socket.emit(SET_ELEMENTS, elements);
    });

    socket.on(GET_AGE, () => {
      socket.emit(SET_AGE, { age });
    });
  }, [
    props.coins,
    props.buildingCards,
    props.wonderCards,
    props.progressTokens,
    props.militaryTokens,
    props.conflictPawn,
    age
  ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, elementId: string) => {
    const isSelected = !!props.selectedElements[elementId];

    if (e.shiftKey) {
      props.onSelectElement(elementId, true);
    } else if (!isSelected) {
      props.onUnselectElements();
    }
  };

  const handleMoveElement = (event: DraggableEvent, data: DraggedData, elementId: string) => {
    const delta = {
      x: data.deltaX,
      y: data.deltaY
    };

    const elementsIds = !!props.selectedElements[elementId] ? Object.keys(props.selectedElements) : [ elementId ];
    const apiEvent: MoveElementAPIEvent = { elementsIds, delta };

    socket.emit(MOVE_ELEMENT, apiEvent);
    elementsIds.forEach((id) => {
      props.onMoveElement(id, delta);
    });
  };

  const handleDoubleClickElement = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, elementId: string) => {
    if (e.shiftKey) {
      const direction = e.getModifierState('CapsLock') 
        ? !e.altKey ? 'forward' : 'backward'
        : !e.altKey ? 'front' : 'back';
      const apiEvent: BringElementAPIEvent = { elementId, direction };
  
      socket.emit(BRING_ELEMENT, apiEvent);
      props.onBringElement(elementId, direction);
    } else {
      const apiEvent: FlipElementAPIEvent = { elementId };

      socket.emit(FLIP_ELEMENT, apiEvent);
      props.onFlipElement(elementId);
    }

    props.onUnselectElements();
  };

  const handleBoardClick = (e: any) => {
    if (!e.target.classList.contains('element')) {
      props.onUnselectElements();
    }
  };

  const loadBuildingCards = (age: Age) => {
    const cards = getBuildingCards(age);
    const apiEvent: AddElementsAPIEvent = cards;

    socket.emit(ADD_ELEMENTS, apiEvent);
    props.onAddElements(cards);
  };

  const startGame = () => {
    const progressTokens = getProgressTokens();
    const militaryTokens = getMilitaryTokens();
    const conflictPawn = getConflictPawn();
    const coins = getCoins();
    const wonders = getWonderCards();

    const initialElements = [
      ...progressTokens,
      ...militaryTokens,
      ...coins,
      ...wonders,
      conflictPawn
    ];

    const apiEvent: SetElementsAPIEvent = initialElements;

    socket.emit(SET_ELEMENTS, apiEvent);
    props.onSetElements(initialElements);
    setAge(null);
    socket.emit(SET_AGE, { age: null });
  }

  const handleChangeAge = (age: Age) => {
    socket.emit(SET_AGE, { age });
    setAge(age);
    loadBuildingCards(age);
  };
  
  return (
    <div className="board" id="draggingarea" onClick={handleBoardClick}>
      <div className="board__players" />
      <div className="board__tools">
        <BoardTools onStart={startGame} onDealBuildings={loadBuildingCards} />
      </div>
      <div className="board__age-progress-container">
        <AgeProgress age={age} onChange={handleChangeAge} />
      </div>
      <div>
        <Element element={getBoardElement()}/>
        {props.militaryTokens.map((el) =>
          <Element 
            key={el.id}
            element={el}
            onDrag={handleMoveElement}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
          />)}
        {props.progressTokens.map((el) =>
          <Element 
            key={el.id}
            element={el}
            selected={!!props.selectedElements[el.id]}
            onDrag={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
          />)}
        {props.conflictPawn && 
          <Element 
            key={props.conflictPawn.id}
            element={props.conflictPawn}
            onDrag={handleMoveElement}
            onDoubleClick={(e) => handleDoubleClickElement(e, props.conflictPawn.id)}
          />}
        {props.buildingCards.map((el) =>
          <Element 
            key={el.id}
            element={el}
            selected={!!props.selectedElements[el.id]}
            onDrag={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
          />)}
        {props.wonderCards.map((el) =>
          <Element 
            key={el.id}
            element={el}
            selected={!!props.selectedElements[el.id]}
            onDrag={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
          />)}
        {props.coins.map((el) =>
          <Element 
            key={el.id}
            element={el}
            selected={!!props.selectedElements[el.id]}
            onDrag={handleMoveElement}
            onMouseDown={(e) => handleMouseDown(e, el.id)}
            onDoubleClick={(e) => handleDoubleClickElement(e, el.id)}
          />)}
      </div>
    </div>
  )
};

const mapStateToProps = (state: AppState): StateProps => ({
  selectedElements: getSelectedElements(state),
  conflictPawn: getElementOfType(state, ElementTypes.CONFLICT_PAWN) || null,
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
  onSetElements: (elements: Array<GameElement>) => setElements(elements),
  onAddElements: (elements: Array<GameElement>) => addElements(elements),
  onMoveElement: (elementId: string, position: Coordinates) => moveElement(elementId, position),
  onFlipElement: (elementId: string) => flipElement(elementId),
  onBringElement: (elementId: string, direction: string) => bringElement(elementId, direction),
  onSelectElement: (elementId: string, selected: boolean) => selectElement(elementId, selected),
  onUnselectElements: () => unselectElements()

};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
