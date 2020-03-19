import React from 'react';
import { cards } from '../../data/cards.json';
import { useEffect, useState } from 'react';
import { Card } from '../../components/card/Card';
import { CardInterface } from '../../types';
import './Board.scss'

const Board = () => {
  const [ eraCards, setEraCards ] = useState<Array<CardInterface>>([]);

  useEffect(() => {
    const shuffledCards = cards.sort(() => Math.random() - 0.5);
    shuffledCards.splice(Math.round(Math.random() * shuffledCards.length), 1);
    shuffledCards.splice(Math.round(Math.random() * shuffledCards.length), 1);
    shuffledCards.splice(Math.round(Math.random() * shuffledCards.length), 1);

    setEraCards(shuffledCards as any as Array<CardInterface>);
  }, []);
  
  return (
    <div className="board">
      { eraCards.map((card, i) => <Card key={`${card.name}-${card.type}`} card={card} initialX={i} initialY={i} />) }
    </div>
  )
};

export default Board;