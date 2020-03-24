import React from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { WONDER_WIDTH, CARD_WIDTH } from '../../contants';
import { Position, GameElement, ElementTypes } from '../../types';
import { getPlayerAMoney, getPlayerBMoney, getElements } from '../../reducers/selectors';
import { setMoney } from '../../actions/players-actions';
import { setElementPosition, setElements, flipElement, addElements } from '../../actions/elements-actions';
import { AppState } from '../../reducers/reducers';
import BuildingCard from '../../components/BuildingCard/BuildingCard';
import PlayerArea from '../PlayerArea/PlayerArea';
import AgeSelect from '../../components/AgeSelect/AgeSelect';
import WonderCard from '../../components/WonderCard/WonderCard';
import {
  getBuildingCardsPlacement,
  getAgeScheme,
  fixThirdAgeCards,
  flipBuildingCards,
  getShuffledCards as getNewBuildingCards
} from './buildingcards-utils';
import { getWonderCardsPlacement, getShuffledCards as getNewWonderCards } from './wondercards-utils';
import { injectPositions, flipCards } from './utils';
import './Board.scss';


interface StateProps {
  buildingCards: Array<GameElement>;
  wonderCards: Array<GameElement>;
  playerAMoney: number;
  playerBMoney: number;
}

interface DispatchProps {
  onSetMoney(player: string, ammount: number): void;
  onSetElements(elements: Array<GameElement>): void;
  onAddElements(elements: Array<GameElement>): void;
  onMoveElemnent(elementId: string, position: Position): void;
  onFlipElemnent(elementId: string): void;
}

interface Props extends StateProps, DispatchProps {};

const Board = (props: Props) => {
  const [ age, setAge ] = useState<'I' | 'II' | 'III'>('I');

  const loadBuildingCards = () => {
    const scheme = getAgeScheme(age);
    const cardsPlacement = getBuildingCardsPlacement(scheme, CARD_WIDTH);
    const shuffledCards = getNewBuildingCards();
    const cards: Array<GameElement> = injectPositions(shuffledCards, cardsPlacement);
    const fixedCards = age === 'III' ? fixThirdAgeCards(cards) : cards;
    const flippedCards = flipBuildingCards(fixedCards, age);

    props.onAddElements(flippedCards);
  };

  const loadWonderCards = () => {
    const wonderCards = getNewWonderCards();
    const cardsPlacement = getWonderCardsPlacement(WONDER_WIDTH);
    const cards: Array<GameElement> = flipCards(injectPositions(wonderCards, cardsPlacement));

    props.onAddElements(cards);
  };
  
  return (
    <div className="board" id="draggingarea">
      <div className="board__tools">
        <AgeSelect value={age} onChange={setAge}/>
        <button onClick={loadWonderCards}>Deal Wonders</button>
        <button onClick={loadBuildingCards}>Deal Buildings</button>
      </div>
      <div className="board__players">
        <PlayerArea
          playerName="1"
          money={props.playerAMoney}
          onSetMoney={(value) => props.onSetMoney('playerA', value)}
        />
        <PlayerArea
          playerName="2"
          money={props.playerBMoney}
          onSetMoney={(value) => props.onSetMoney('playerB', value)}
        />
      </div>
      <div>
        {props.buildingCards.map((card) =>
          <BuildingCard 
            key={card.id}
            card={card}
            onDrag={props.onMoveElemnent}
            onDoubleClick={props.onFlipElemnent}
          />)}
        {props.wonderCards.map((card) =>
          <WonderCard 
            key={card.id}
            card={card}
            onDrag={props.onMoveElemnent}
            onDoubleClick={props.onFlipElemnent}
          />)}
      </div>
    </div>
  )
};

const mapStateToProps = (state: AppState): StateProps => ({
  buildingCards: getElements(state, ElementTypes.BUILDING_CARD),
  wonderCards: getElements(state, ElementTypes.WONDER_CARD),
  playerAMoney: getPlayerAMoney(state),
  playerBMoney: getPlayerBMoney(state)
});

const mapDispatchToProps: DispatchProps = {
  onSetMoney: (player: 'playerA' | 'playerB', ammount: number) => setMoney(player, ammount),
  onSetElements: (elements: Array<GameElement>) => setElements(elements),
  onAddElements: (elements: Array<GameElement>) => addElements(elements),
  onMoveElemnent: (elementId: string, position: Position) => setElementPosition(elementId, position),
  onFlipElemnent: (elementId: string) => flipElement(elementId)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
