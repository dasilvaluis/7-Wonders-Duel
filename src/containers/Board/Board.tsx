import React, { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { WONDER_WIDTH, BUILDING_WIDTH, CARD_MARGIN, BOARD_WIDTH, COIN_WIDTH_3, COIN_WIDTH_1, COIN_WIDTH_6 } from '../../contants';
import { Position, GameElement, ElementTypes, Age, MoveElementAPIEvent, FlipElementAPIEvent, AddElementsAPIEvent, SetElementsAPIEvent } from '../../types';
import { getPlayerAMoney, getPlayerBMoney, getElements } from '../../reducers/selectors';
import { setMoney } from '../../actions/players-actions';
import { setElementPosition, setElements, flipElement, addElements } from '../../actions/elements-actions';
import { AppState } from '../../reducers/reducers';
import PlayerArea from '../PlayerArea/PlayerArea';
import AgeSelect from '../../components/AgeSelect/AgeSelect';
import {
  getBuildingCardsPlacement,
  getAgeScheme,
  fixThirdAgeCards,
  flipBuildingCards,
  getShuffledCards as getNewBuildingCards
} from './buildingcards-utils';
import { getWonderCardsPlacement, getShuffledCards as getNewWonderCards } from './wondercards-utils';
import { injectPositions, flipCards, getBoardElement, movePositions, getCoinsPlacement, getCoinElements } from './board-utils';
import Element from '../../components/Element/Element';
import { socket }  from '../../websocketClient';
import './Board.scss';

interface StateProps {
  elements: Array<GameElement>;
  coins: Array<GameElement>;
  buildingCards: Array<GameElement>;
  wonderCards: Array<GameElement>;
  playerAMoney: number;
  playerBMoney: number;
}

interface DispatchProps {
  onSetMoney(player: string, ammount: number): void;
  onSetElements(elements: Array<GameElement>): void;
  onAddElements(elements: Array<GameElement>): void;
  onMoveElement(elementId: string, position: Position): void;
  onFlipElement(elementId: string): void;
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

    socket.on('flip_element', (data: FlipElementAPIEvent) => {
      props.onFlipElement(data.elementId);
    });

    socket.on('add_elements', (data: AddElementsAPIEvent) => {
      props.onAddElements(data);
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

  const handleFlipElement = (elementId: string) => {
    const apiEvent: FlipElementAPIEvent = { elementId };

    socket.emit('flip_element', apiEvent);
    props.onFlipElement(elementId);
  };

  const loadBuildingCards = () => {
    const scheme = getAgeScheme(age);
    const cardsPlacement = getBuildingCardsPlacement(scheme, BUILDING_WIDTH);
    const cardsPlacementShifted = movePositions(cardsPlacement, {
      x: 0, y: CARD_MARGIN * 2
    });
    const shuffledCards = getNewBuildingCards(age);
    const cards: Array<GameElement> = injectPositions(shuffledCards, cardsPlacementShifted);
    const fixedCards = age === 'III' ? fixThirdAgeCards(cards) : cards;
    const flippedCards = flipBuildingCards(fixedCards, age);

    
    const apiEvent: AddElementsAPIEvent = flippedCards;

    socket.emit('add_elements', apiEvent);
    props.onAddElements(flippedCards);
  };

  const loadWonderCards = () => {
    const wonderCards = getNewWonderCards();
    const cardsPlacement = getWonderCardsPlacement(WONDER_WIDTH);
    const cards: Array<GameElement> = flipCards(injectPositions(wonderCards, cardsPlacement));
    const apiEvent: AddElementsAPIEvent = cards;

    socket.emit('add_elements', apiEvent);
    props.onAddElements(cards);
  };

  const loadCoins = () => {
    const coinElements6 = getCoinElements(6);
    const coinElements3 = getCoinElements(3);
    const coinElements1 = getCoinElements(1);

    const coinPlacements6 = getCoinsPlacement(6);
    const coinPlacements3 = getCoinsPlacement(3);
    const coinPlacements1 = getCoinsPlacement(1);
  
    const coinPlacements6Shifted = movePositions(coinPlacements6, {
      x: BOARD_WIDTH - COIN_WIDTH_6 * 2.5 - CARD_MARGIN,
      y: CARD_MARGIN
    });
  
    const coinPlacements3Shifted = movePositions(coinPlacements3, {
      x: BOARD_WIDTH - COIN_WIDTH_3 * 2.5 - CARD_MARGIN,
      y: CARD_MARGIN + COIN_WIDTH_6 * 1.5
    });
  
    const coinPlacements1Shifted = movePositions(coinPlacements1, {
      x: BOARD_WIDTH - COIN_WIDTH_1 * 2.5 - CARD_MARGIN,
      y: CARD_MARGIN + COIN_WIDTH_3 * 3.5
    });

    const coins6 = injectPositions(coinElements6, coinPlacements6Shifted);
    const coins3 = injectPositions(coinElements3, coinPlacements3Shifted);
    const coins1 = injectPositions(coinElements1, coinPlacements1Shifted);

    const coins = [
      ...coins6,
      ...coins3,
      ...coins1
    ];

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
      <div className="board__tools">
        <AgeSelect value={age} onChange={setAge}/>
        <button onClick={loadCoins}>Deal Coins</button>
        <button onClick={loadWonderCards}>Deal Wonders</button>
        <button onClick={loadBuildingCards}>Deal Buildings</button>
        <button onClick={handleClear}>Clear</button>
      </div>
      <div className="board__players">
        <PlayerArea
          money={props.playerAMoney}
          onSetMoney={(value) => props.onSetMoney('playerA', value)}
        />
        <PlayerArea
          money={props.playerBMoney}
          onSetMoney={(value) => props.onSetMoney('playerB', value)}
        />
      </div>
      <div>
        <Element element={getBoardElement()}/>
        {props.coins.map((coin) =>
          <Element 
            key={coin.id}
            element={coin}
            onDrag={handleMoveElement}
            onDoubleClick={handleFlipElement}
          />)}
        {props.buildingCards.map((card) =>
          <Element 
            key={card.id}
            element={card}
            onDrag={handleMoveElement}
            onDoubleClick={handleFlipElement}
          />)}
        {props.wonderCards.map((card) =>
          <Element 
            key={card.id}
            element={card}
            onDrag={handleMoveElement}
            onDoubleClick={handleFlipElement}
          />)}
      </div>
    </div>
  )
};

const mapStateToProps = (state: AppState): StateProps => ({
  elements: getElements(state),
  coins: [ 
    ...getElements(state, ElementTypes.COIN_6),
    ...getElements(state, ElementTypes.COIN_3),
    ...getElements(state, ElementTypes.COIN_1)
  ],
  buildingCards: getElements(state, ElementTypes.BUILDING_CARD),
  wonderCards: getElements(state, ElementTypes.WONDER_CARD),
  playerAMoney: getPlayerAMoney(state),
  playerBMoney: getPlayerBMoney(state)
});

const mapDispatchToProps: DispatchProps = {
  onSetMoney: (player: 'playerA' | 'playerB', ammount: number) => setMoney(player, ammount),
  onSetElements: (elements: Array<GameElement>) => setElements(elements),
  onAddElements: (elements: Array<GameElement>) => addElements(elements),
  onMoveElement: (elementId: string, position: Position) => setElementPosition(elementId, position),
  onFlipElement: (elementId: string) => flipElement(elementId)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
