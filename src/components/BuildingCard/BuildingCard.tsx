import React from "react";
import { Position, GameElement } from '../../types';
import { BaseElement } from "../BaseElement/BaseElement";
import './BuildingCard.scss';

interface Props {
  card: GameElement;
  onDrag(id: string, position: Position): void;
  onDoubleClick(id: string): void;
}

export default (props: Props) => (
  <BaseElement
    id={props.card.id}
    position={{x: props.card.x, y: props.card.y}}
    onDrag={props.onDrag}
    onDoubleClick={props.onDoubleClick}
  >
    <div className={`buildingcard -${props.card.type} ${props.card.faceDown ? '-facedown' : '-faceup'}`}>
      <span>{props.card.name}</span>
    </div>
  </BaseElement>
);
