import React from 'react';
import { useEffect, useState } from 'react';
import { AgeCard } from '../../components/AgeCard/AgeCard';
import { shuffleAndLimitArray, injectPositions, getRandomElements } from './utils';
import { getAgeCardsPlacement, getAgeScheme, fixThirdAgeCards } from './agecards-utils';
import { MAX_CARDS } from '../../contants';
import PlayerArea from '../PlayerArea/PlayerArea';
import { cards as cardsDb } from '../../data/cards.json';
import { wonders } from '../../data/wonders.json';
import { AppState } from '../../reducers';
import { getPlayerAMoney, getPlayerBMoney, getAgeCards, getWonderCards } from '../../reducers/selectors';
import { connect } from 'react-redux';
import { setMoney } from '../../actions/players-actions';
import { setAgeCards, setAgeCardPosition } from '../../actions/cards-actions';
import './Board.scss'
import { Position, GameElement } from '../../types';
import AgeSelect from '../../components/AgeSelect/AgeSelect';
import { getWonderCardsPlacement } from './wondercards-utils';
import { WonderCard } from '../../components/WonderCard/WonderCard';
import { setWonderCardPosition, setWonderCards } from '../../actions/wonders-actions';

interface StateProps {
  ageCards: Array<GameElement>;
  wonderCards: Array<GameElement>;
  playerAMoney: number;
  playerBMoney: number;
}

interface DispatchProps {
  onSetMoney(player: string, ammount: number): void;
  onSetAgeCards(cards: Array<GameElement>): void;
  onMoveAgeCard(cardIndex: number, position: Position): void;
  onSetWonderCards(cards: Array<GameElement>): void;
  onMoveWonderCard(cardIndex: number, position: Position): void;
}

interface Props extends StateProps, DispatchProps {};

const Board = (props: Props) => {
  const [ age, setAge ] = useState<'I' | 'II' | 'III'>('I');

  const loadAgeCards = () => {
    const scheme = getAgeScheme(age);
    const cardsPlacement = getAgeCardsPlacement(scheme);
    const shuffledCards = shuffleAndLimitArray(cardsDb, MAX_CARDS).map(({ name, type }) => ({ name, type }));
    const cards: Array<GameElement> = injectPositions(shuffledCards, cardsPlacement);

    const finalCards = age === 'III' ? fixThirdAgeCards(cards) : cards;
      
    props.onSetAgeCards(finalCards);
  };

  const loadWonders = () => {
    const wonderCards = getRandomElements(wonders, 4);
    const cardsPlacement = getWonderCardsPlacement();
    const cards: Array<GameElement> = injectPositions(wonderCards, cardsPlacement);

    props.onSetWonderCards(cards);
  };

  useEffect( () => {
    loadAgeCards();
    loadWonders();
  }, [ age ]);
  
  return (
    <div className="board" id="draggingarea">
      <div className="board__tools">
        <AgeSelect value={age} onChange={setAge}/>
        <button onClick={loadAgeCards}>Reshuffle</button>
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
        {props.ageCards.map((card, index) =>
          <AgeCard 
            key={`${card.name}-${card.type}`}
            index={index}
            card={card}
            x={card.x}
            y={card.y}
            onMoveStop={props.onMoveAgeCard}
          />)}
        {props.wonderCards.map((card, index) =>
          <WonderCard 
            key={`${card.name}-${card.type}`}
            index={index}
            card={card}
            x={card.x}
            y={card.y}
            onMoveStop={props.onMoveWonderCard}
          />)}
      </div>{/*  */}
    </div>
  )
};

const mapStateToProps = (state: AppState): StateProps => ({
  ageCards: getAgeCards(state),
  wonderCards: getWonderCards(state),
  playerAMoney: getPlayerAMoney(state),
  playerBMoney: getPlayerBMoney(state)
});

const mapDispatchToProps: DispatchProps = {
  onSetMoney: (player: 'playerA' | 'playerB', ammount: number) => setMoney(player, ammount),
  onSetAgeCards: (cards: Array<GameElement>) => setAgeCards(cards),
  onMoveAgeCard: (cardIndex: number, position: Position) => setAgeCardPosition(cardIndex, position),
  onSetWonderCards: (cards: Array<GameElement>) => setWonderCards(cards),
  onMoveWonderCard: (cardIndex: number, position: Position) => setWonderCardPosition(cardIndex, position)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
