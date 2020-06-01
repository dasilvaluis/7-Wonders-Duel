import React from 'react';
import './Modal.scss';

interface Props {
  open: boolean;
  children: JSX.Element | Array<JSX.Element>;
  onClose(): void;
}

export default ({
  open,
  children,
  onClose
}: Props) => open && (
  <div className="modal">
    <button className="modal__close" onClick={onClose}>X</button>
    { children }
  </div>
);
