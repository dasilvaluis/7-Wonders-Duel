import React from 'react';
import cn from 'classnames';
import './modal.scss';

type Props = {
  open: boolean;
  children: JSX.Element | Array<JSX.Element>;
  noPosition?: boolean;
  onClose(): void;
};

export default ({
  open,
  children,
  noPosition,
  onClose
}: Props) => open && (
  <div className={cn(
    'modal',
    { '-no-position': noPosition }
  )}>
    <button className="modal__close" onClick={onClose}>X</button>
    { children }
  </div>
);
