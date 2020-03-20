import React from 'react';
import { useEffect, useState } from 'react';
import { Card } from '../../components/card/Card';
import { CardInterface } from '../../types';
import './Board.scss'
import { getCardsPlacement, schemeFirstEra, movePositions, getCards } from './utils';
import { BOARD_WIDTH } from '../../contants';
import PlayerArea from '../PlayerArea/PlayerArea';
import { DraggingArea } from '../DraggingArea/DraggingArea';

const Board = () => {
  const [ eraCards, setEraCards ] = useState<Array<CardInterface>>([]);

  useEffect(() => {
    const cardsPlacement = movePositions(getCardsPlacement(schemeFirstEra), {
      x: BOARD_WIDTH / 2,
      y: 0
    });

    const cards: CardInterface[] = getCards().map((card, index) => {
      const { name, type } = card;
      const { x, y } = typeof cardsPlacement[index] !== 'undefined'
        ? { x: cardsPlacement[index].x, y: cardsPlacement[index].y }
        : { x: 0, y: 0 };

      return { name, type, x, y };
    });
    
    setEraCards(cards);
  }, []);
  
  return (
    <>
      <div className="board">
        <DraggingArea>
          {eraCards.map((card) =>
            <Card 
              key={`${card.name}-${card.type}`}
              card={card}
              initialX={card.x}
              initialY={card.y}
            />)}
        </DraggingArea>
        <div className="board__players">
          <PlayerArea playerName="1" />
          <PlayerArea playerName="2" />
        </div>
      </div>
    </>
  )
};

export default Board;