import React from 'react';
import './PlayerArea.scss';

interface Props {
  civilization: string;
}

export default (props: Props) => (
  <div className={`player-area -${ props.civilization }`} />
);
