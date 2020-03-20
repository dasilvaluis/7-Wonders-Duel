import React from 'react';
import { useEffect, useState } from 'react';
import { AgeCard } from '../../components/AgeCard/AgeCard';
import { getCardsPlacement, schemeFirstEra, shuffleAndLimitArray } from './utils';
import { MAX_CARDS } from '../../contants';
import PlayerArea from '../PlayerArea/PlayerArea';
import { cards as cardsDb } from '../../data/cards.json';
import { AppState } from '../../reducers';
import { getPlayerAMoney, getPlayerBMoney, getAgeCards } from '../../reducers/selectors';
import { connect } from 'react-redux';
import { setMoney } from '../../actions/players-actions';
import { AgeCard as AgeCardInterface } from '../../reducers/cards-reducer';
import { setCards } from '../../actions/cards-actions';
import './Board.scss'
import Selector from '../../components/Selector/Select';

interface StateProps {
  ageCards: Array<AgeCardInterface>;
  playerAMoney: number;
  playerBMoney: number;
}

interface DispatchProps {
  setMoney(player: string, ammount: number): void;
  setAgeCards(cards: Array<AgeCardInterface>): void;
}

interface Props extends StateProps, DispatchProps {}

const Board = (props: Props) => {
  const [ age, setAge ] = useState<string>('1');

  useEffect(() => {
    const cardsPlacement = getCardsPlacement(schemeFirstEra);

    const cards: Array<AgeCardInterface> = shuffleAndLimitArray([ ...cardsDb ], MAX_CARDS)
      .map((card, index) => {
        const { name, type } = card;
        const { x, y } = typeof cardsPlacement[index] !== 'undefined'
          ? { x: cardsPlacement[index].x, y: cardsPlacement[index].y }
          : { x: 0, y: 0 };

        return { name, type, x, y };
      });
      
    props.setAgeCards(cards);
  }, [ age ]);
  
  return (
    <>
      <div className="board" id="draggingarea">
        <div className="board__age-switcher">
          <Selector value={age} onChange={setAge}/>
        </div>
        <div className="board__players">
          <PlayerArea
            playerName="1"
            money={props.playerAMoney}
            onSetMoney={(value) => props.setMoney('playerA', value)}
          />
          <PlayerArea
            playerName="2"
            money={props.playerBMoney}
            onSetMoney={(value) => props.setMoney('playerB', value)}
          />
        </div>
        <div>
          {props.ageCards.map((card) =>
            <AgeCard 
              key={`${card.name}-${card.type}`}
              card={card}
              x={card.x}
              y={card.y}
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
  setMoney: (player: 'playerA' | 'playerB', ammount: number) => setMoney(player, ammount),
  setAgeCards: (cards: Array<AgeCardInterface>) => setCards(cards)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Board);
