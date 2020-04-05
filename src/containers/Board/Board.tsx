import React, { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { Position, GameElement, ElementTypes, Age, MoveElementAPIEvent, FlipElementAPIEvent, AddElementsAPIEvent, SetElementsAPIEvent, BringElementAPIEvent, DraggedData, ElementsMap } from '../../types';
import { getElements, getElementOfType, getSelectedElements } from '../../reducers/selectors';
import { setElementPosition, setElements, flipElement, addElements, bringElement } from '../../actions/elements-actions';
import { AppState } from '../../reducers/reducers';
import AgeSelect from '../../components/AgeSelect/AgeSelect';
import { getBuildingCards } from './buildingcards-utils';
import { getWonderCards } from './wondercards-utils';
import { getBoardElement, getProgressTokens, getMilitaryTokens, getConflictPawn } from './board-utils';
import { getCoins } from './coins-utils';
import Element from '../../components/Element/Element';
import { socket }  from '../../client';
import { selectElement, unselectElements } from '../../actions/selected-elements-actions';
import { DraggableEvent } from 'react-draggable';
import './Board.scss';

interface StateProps {
  elements: Array<GameElement>;
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
  onMoveElement(elementId: string, position: Position): void;
  onFlipElement(elementId: string): void;
  onBringElement(elementId: string, direction: string): void;
  onSelectElement(elementId: string, selected: boolean): void;
  onUnselectElements(): void;
}

interface Props extends StateProps, DispatchProps {};

const Board = (props: Props) => {
  const [ age, setAge ] = useState<Age>('I');

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('get_elements');
    });

    socket.on('set_elements', (data: SetElementsAPIEvent) => {
      props.onSetElements(data);
    });

    socket.on('move_element', (data: MoveElementAPIEvent) => {
      const { elementId, position } = data;

      props.onMoveElement(elementId, position);
    });

    socket.on('add_elements', (data: AddElementsAPIEvent) => {
      props.onAddElements(data);
    });

    socket.on('flip_element', (data: FlipElementAPIEvent) => {
      props.onFlipElement(data.elementId);
    });

    socket.on('bring_element', (data: BringElementAPIEvent) => {
      props.onBringElement(data.elementId, data.direction);
    });
  }, []);
  
  useEffect(() => {
    if (socket.hasListeners('get_elements') ) {
      socket.off('get_elements');
    }

    socket.on('get_elements', () => {
      socket.emit('set_elements', props.elements);
    });
  }, [ props.elements ]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, elementId: string) => {
    const isSelected = !!props.selectedElements[elementId];

    if (e.shiftKey) {
      props.onSelectElement(elementId, true);
    } else if (!isSelected) {
      props.onUnselectElements();
    }
  };

  const handleMoveElement = (event: DraggableEvent, data: DraggedData, elementId: string) => {
    const isSelected = !!props.selectedElements[elementId];
    
    if (isSelected) {
      Object.values(props.selectedElements).forEach((element) => {
        const newPosition = {
          x: element.x + data.deltaX,
          y: element.y + data.deltaY
        };

        const apiEvent: MoveElementAPIEvent = {
          elementId: element.id,
          position: newPosition
        };
    
        socket.emit('move_element', apiEvent);
        props.onMoveElement(element.id, newPosition);
      });
    } else {
      const position = {
        x: data.x,
        y: data.y
      };
      const apiEvent: MoveElementAPIEvent = { elementId, position };
  
      socket.emit('move_element', apiEvent);
      props.onMoveElement(elementId, position);
    }
  };

  const handleDoubleClickElement = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, elementId: string) => {
    if (e.shiftKey) {
      const direction = e.getModifierState('CapsLock') 
        ? !e.altKey ? 'forward' : 'backward'
        : !e.altKey ? 'front' : 'back';
      const apiEvent: BringElementAPIEvent = { elementId, direction };
  
      socket.emit('bring_element', apiEvent);
      props.onBringElement(elementId, direction);
    } else {
      const apiEvent: FlipElementAPIEvent = { elementId };

      socket.emit('flip_element', apiEvent);
      props.onFlipElement(elementId);
    }

    props.onUnselectElements();
  };

  const handleBoardClick = (e: any) => {
    if (!e.target.classList.contains('element')) {
      props.onUnselectElements();
    }
  };

  const loadBuildingCards = () => {
    const cards = getBuildingCards(age);
    const apiEvent: AddElementsAPIEvent = cards;

    socket.emit('add_elements', apiEvent);
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
      conflictPawn,
      ...coins,
      ...wonders
    ];

    const apiEvent: SetElementsAPIEvent = initialElements;

    socket.emit('set_elements', apiEvent);
    props.onSetElements(initialElements);
    setAge('I');
  }

  const clearGame = () => {
    socket.emit('set_elements', []);
    props.onSetElements([]);
    setAge('I');
  };
  
  return (
    <div className="board" id="draggingarea" onClick={handleBoardClick}>
      <div className="board__players" />
      <div className="board__tools">
        <button className="board__tool" onClick={startGame}>Start Game</button>
        <button className="board__tool" onClick={clearGame}>Clear</button>
        <hr/>
        <div className="board__tool -no-shadow">
          <AgeSelect value={age} onChange={setAge}/>
        </div>
        <button className="board__tool" onClick={loadBuildingCards}>Deal Buildings</button>
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
  elements: getElements(state),
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
  onMoveElement: (elementId: string, position: Position) => setElementPosition(elementId, position),
  onFlipElement: (elementId: string) => flipElement(elementId),
  onBringElement: (elementId: string, direction: string) => bringElement(elementId, direction),
  onSelectElement: (elementId: string, selected: boolean) => selectElement(elementId, selected),
  onUnselectElements: () => unselectElements()

};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
