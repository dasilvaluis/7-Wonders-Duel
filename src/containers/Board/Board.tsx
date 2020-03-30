import React, { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { Position, GameElement, ElementTypes, Age, MoveElementAPIEvent, FlipElementAPIEvent, AddElementsAPIEvent, SetElementsAPIEvent, BringElementAPIEvent } from '../../types';
import { getElements, getElementOfType } from '../../reducers/selectors';
import { setMoney } from '../../actions/players-actions';
import { setElementPosition, setElements, flipElement, addElements, bringElement } from '../../actions/elements-actions';
import { AppState } from '../../reducers/reducers';
import PlayerArea from '../PlayerArea/PlayerArea';
import AgeSelect from '../../components/AgeSelect/AgeSelect';
import { getBuildingCards } from './buildingcards-utils';
import { getWonderCards } from './wondercards-utils';
import { getBoardElement, getProgressTokens, getMilitaryTokens, getConflictPawn } from './board-utils';
import { getCoins } from './coins-utils';
import Element from '../../components/Element/Element';
import { socket }  from '../../client';
import './Board.scss';

interface StateProps {
  elements: Array<GameElement>;
  coins: Array<GameElement>;
  buildingCards: Array<GameElement>;
  wonderCards: Array<GameElement>;
  progressTokens: Array<GameElement>;
  militaryTokens: Array<GameElement>;
  conflictPawn: GameElement | null;
}

interface DispatchProps {
  onSetMoney(player: string, ammount: number): void;
  onSetElements(elements: Array<GameElement>): void;
  onAddElements(elements: Array<GameElement>): void;
  onMoveElement(elementId: string, position: Position): void;
  onFlipElement(elementId: string): void;
  onBringElement(elementId: string, direction: string): void;
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

  const handleMoveElement = (elementId: string, position: Position) => {
    const apiEvent: MoveElementAPIEvent = { elementId, position };

    socket.emit('move_element', apiEvent);
    props.onMoveElement(elementId, position);
  };

  const handleDoubleClickElement = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, elementId: string) => {
    if (e.shiftKey) {
      const direction = e.getModifierState('CapsLock') 
        ? !e.altKey ? 'forward' : 'backward'
        : !e.altKey ? 'front' : 'back';
      const apiEvent: BringElementAPIEvent = { elementId, direction };
  
      socket.emit('bring_element', apiEvent);
      props.onBringElement(elementId, direction);

      return; 
    }

    const apiEvent: FlipElementAPIEvent = { elementId };

    socket.emit('flip_element', apiEvent);
    props.onFlipElement(elementId);
  };

  const loadBuildingCards = () => {
    const cards = getBuildingCards(age);
    const apiEvent: AddElementsAPIEvent = cards;

    socket.emit('add_elements', apiEvent);
    props.onAddElements(cards);
  };

  const loadWonderCards = () => {
    const cards = getWonderCards();
    const apiEvent: AddElementsAPIEvent = cards;

    socket.emit('add_elements', apiEvent);
    props.onAddElements(cards);
  };

  const loadProgressBoard = () => {
    const progressTokens = getProgressTokens();
    const militaryTokens = getMilitaryTokens();
    const conflictPawn = getConflictPawn();

    const tokens = [ ...progressTokens, ...militaryTokens, conflictPawn ];
    const apiEvent: AddElementsAPIEvent = tokens;

    socket.emit('add_elements', apiEvent);
    props.onAddElements(tokens);
  };

  const loadCoins = () => {
    const coins = getCoins();
    const apiEvent: AddElementsAPIEvent = coins;

    socket.emit('add_elements', apiEvent);
    props.onAddElements(coins);
  };

  const handleClear = () => {
    socket.emit('set_elements', []);
    props.onSetElements([]);
  };
  
  return (
    <div className="board" id="draggingarea">
      <div className="board__players">
        <PlayerArea civilization="roman" />
        <PlayerArea civilization="egyptian" />
      </div>
      <div className="board__tools">
        <button className="board__tool" onClick={loadProgressBoard}>Load Progress Board</button>
        <button className="board__tool" onClick={loadCoins}>Deal Coins</button>
        <button className="board__tool" onClick={loadWonderCards}>Deal Wonders</button>
        <button className="board__tool" onClick={handleClear}>Clear</button>
        <hr/>
        <div className="board__tool -no-shadow">
          <AgeSelect value={age} onChange={setAge}/>
        </div>
        <button className="board__tool" onClick={loadBuildingCards}>Deal Buildings</button>
      </div>
      <div>
        <Element element={getBoardElement()}/>
        {props.militaryTokens.map((token) =>
          <Element 
            key={token.id}
            element={token}
            onDrag={handleMoveElement}
            onDoubleClick={handleDoubleClickElement}
          />)}
        {props.progressTokens.map((token) =>
          <Element 
            key={token.id}
            element={token}
            onDrag={handleMoveElement}
            onDoubleClick={handleDoubleClickElement}
          />)}
        {props.conflictPawn && 
          <Element 
            key={props.conflictPawn.id}
            element={props.conflictPawn}
            onDrag={handleMoveElement}
            onDoubleClick={handleDoubleClickElement}
          />}
        {props.buildingCards.map((card) =>
          <Element 
            key={card.id}
            element={card}
            onDrag={handleMoveElement}
            onDoubleClick={handleDoubleClickElement}
          />)}
        {props.wonderCards.map((card) =>
          <Element 
            key={card.id}
            element={card}
            onDrag={handleMoveElement}
            onDoubleClick={handleDoubleClickElement}
          />)}
        {props.coins.map((coin) =>
          <Element 
            key={coin.id}
            element={coin}
            onDrag={handleMoveElement}
            onDoubleClick={handleDoubleClickElement}
          />)}
      </div>
    </div>
  )
};

const mapStateToProps = (state: AppState): StateProps => ({
  elements: getElements(state),
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
  onSetMoney: (player: 'playerA' | 'playerB', ammount: number) => setMoney(player, ammount),
  onSetElements: (elements: Array<GameElement>) => setElements(elements),
  onAddElements: (elements: Array<GameElement>) => addElements(elements),
  onMoveElement: (elementId: string, position: Position) => setElementPosition(elementId, position),
  onFlipElement: (elementId: string) => flipElement(elementId),
  onBringElement: (elementId: string, direction: string) => bringElement(elementId, direction)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
