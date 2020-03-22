import React from 'react';
import { useState } from 'react';
import { BuildingCard } from '../../components/BuildingCard/BuildingCard';
import { injectPositions, getRandomElements } from './utils';
import { getBuildingCardsPlacement, getAgeScheme, fixThirdAgeCards } from './buildingcards-utils';
import { MAX_CARDS, WONDER_WIDTH, CARD_WIDTH } from '../../contants';
import PlayerArea from '../PlayerArea/PlayerArea';
import { cards as cardsDb } from '../../data/cards.json';
import { wonders } from '../../data/wonders.json';
import { AppState } from '../../reducers';
import { getPlayerAMoney, getPlayerBMoney, getBuildingCards, getWonderCards } from '../../reducers/selectors';
import { connect } from 'react-redux';
import { setMoney } from '../../actions/players-actions';
import { setBuildingCards, setBuildingCardPosition, flipCard } from '../../actions/cards-actions';
import { Position, GameElement } from '../../types';
import AgeSelect from '../../components/AgeSelect/AgeSelect';
import { getWonderCardsPlacement } from './wondercards-utils';
import { WonderCard } from '../../components/WonderCard/WonderCard';
import { setWonderCardPosition, setWonderCards, flipWonder } from '../../actions/wonders-actions';
import './Board.scss';

interface StateProps {
  buildingCards: Array<GameElement>;
  wonderCards: Array<GameElement>;
  playerAMoney: number;
  playerBMoney: number;
}

interface DispatchProps {
  onSetMoney(player: string, ammount: number): void;
  onSetBuildingCards(cards: Array<GameElement>): void;
  onMoveBuildingCard(cardIndex: number, position: Position): void;
  onSetWonderCards(cards: Array<GameElement>): void;
  onMoveWonderCard(cardIndex: number, position: Position): void;
  onFlipBuildingCard(cardIndex: number): void;
  onFlipWonderCard(cardIndex: number): void;
}

interface Props extends StateProps, DispatchProps {};

const Board = (props: Props) => {
  const [ age, setAge ] = useState<'I' | 'II' | 'III'>('I');

  const loadBuildingCards = () => {
    const scheme = getAgeScheme(age);
    const cardsPlacement = getBuildingCardsPlacement(scheme, CARD_WIDTH);
    const shuffledCards = getRandomElements(cardsDb, MAX_CARDS).map(({ name, type }) => ({ name, type }));
    const cards: Array<GameElement> = injectPositions(shuffledCards, cardsPlacement);

    const finalCards = age === 'III' ? fixThirdAgeCards(cards) : cards;
      
    props.onSetBuildingCards(finalCards);
  };

  const loadWonderCards = () => {
    const wonderCards = getRandomElements(wonders, 8);
    const cardsPlacement = getWonderCardsPlacement(WONDER_WIDTH);
    const cards: Array<GameElement> = injectPositions(wonderCards, cardsPlacement);

    props.onSetWonderCards(cards);
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
        {props.buildingCards.map((card, index) =>
          <BuildingCard 
            key={`${card.name}-${card.type}`}
            index={index}
            card={card}
            onMoveStop={props.onMoveBuildingCard}
            onDoubleClick={props.onFlipBuildingCard}
          />)}
        {props.wonderCards.map((card, index) =>
          <WonderCard 
            key={`${card.name}-${card.type}`}
            index={index}
            card={card}
            onMoveStop={props.onMoveWonderCard}
            onDoubleClick={props.onFlipWonderCard}
          />)}
      </div>
    </div>
  )
};

const mapStateToProps = (state: AppState): StateProps => ({
  buildingCards: getBuildingCards(state),
  wonderCards: getWonderCards(state),
  playerAMoney: getPlayerAMoney(state),
  playerBMoney: getPlayerBMoney(state)
});

const mapDispatchToProps: DispatchProps = {
  onSetMoney: (player: 'playerA' | 'playerB', ammount: number) => setMoney(player, ammount),
  onSetBuildingCards: (cards: Array<GameElement>) => setBuildingCards(cards),
  onMoveBuildingCard: (cardIndex: number, position: Position) => setBuildingCardPosition(cardIndex, position),
  onSetWonderCards: (cards: Array<GameElement>) => setWonderCards(cards),
  onMoveWonderCard: (cardIndex: number, position: Position) => setWonderCardPosition(cardIndex, position),
  onFlipBuildingCard: (cardIndex: number) => flipCard(cardIndex),
  onFlipWonderCard: (cardIndex: number) => flipWonder(cardIndex)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
