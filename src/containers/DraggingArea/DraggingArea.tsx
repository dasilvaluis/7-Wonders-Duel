import React from 'react';
import './DraggingArea.scss'

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const DraggingArea = (props: Props) => <div className="draggingarea" id="draggingarea">{props.children}</div>
