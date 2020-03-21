import React from 'react';
import { useEffect, useState } from 'react';
import { AgeCard } from '../../components/AgeCard/AgeCard';
import { getCardsPlacement, shuffleAndLimitArray, injectPositionsInCards, getAgeScheme } from './utils';
import { MAX_CARDS } from '../../contants';
import PlayerArea from '../PlayerArea/PlayerArea';
import { cards as cardsDb } from '../../data/cards.json';
import { AppState } from '../../reducers';
import { getPlayerAMoney, getPlayerBMoney, getAgeCards } from '../../reducers/selectors';
import { connect } from 'react-redux';
import { setMoney } from '../../actions/players-actions';
import { AgeCard as AgeCardInterface } from '../../reducers/cards-reducer';
import { setAgeCards, setAgeCardPosition } from '../../actions/cards-actions';
import './Board.scss'
import { Position } from '../../types';
import AgeSelect from '../../components/AgeSelect/AgeSelect';

interface StateProps {
  ageCards: Array<AgeCardInterface>;
  playerAMoney: number;
  playerBMoney: number;
}

interface DispatchProps {
  onSetMoney(player: string, ammount: number): void;
  onSetAgeCards(cards: Array<AgeCardInterface>): void;
  onMoveAgeCard(cardIndex: number, position: Position): void;
}

interface Props extends StateProps, DispatchProps {};

const Board = (props: Props) => {
  const [ age, setAge ] = useState<'I' | 'II' | 'III'>('I');

  const loadCards = () => {
    const scheme = getAgeScheme(age);
    const cardsPlacement = getCardsPlacement(scheme);
    const shuffledCards = shuffleAndLimitArray(cardsDb, MAX_CARDS);
    const cards = injectPositionsInCards(shuffledCards, cardsPlacement);

    const finalCards = age === 'III' ? fixThirdAgeCards(cards) : cards;
      
    props.onSetAgeCards(finalCards);
  }

  useEffect(loadCards, [ age ]);
  
  return (
    <>
      <div className="board" id="draggingarea">
        <div className="board__age-switcher">
          <AgeSelect value={age} onChange={setAge}/>
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
        </div>
      </div>
    </>
  )
};

const mapStateToProps = (state: AppState): StateProps => ({
  ageCards: getAgeCards(state),
  playerAMoney: getPlayerAMoney(state),
  playerBMoney: getPlayerBMoney(state)
});

const mapDispatchToProps: DispatchProps = {
  onSetMoney: (player: 'playerA' | 'playerB', ammount: number) => setMoney(player, ammount),
  onSetAgeCards: (cards: Array<AgeCardInterface>) => setAgeCards(cards),
  onMoveAgeCard: (cardIndex: number, position: Position) => setAgeCardPosition(cardIndex, position)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
