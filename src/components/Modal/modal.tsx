import cn from 'classnames';
import './modal.scss';

type Props = {
  open: boolean;
  children: React.ReactNode;
  noPosition?: boolean;
  onClose(): void;
};

export const Modal = ({ open, children, noPosition, onClose }: Props) =>
  open && (
    <div className={cn('modal', { '-no-position': noPosition })}>
      <button className="modal__close" onClick={onClose} onTouchEnd={onClose}>
        X
      </button>
      {children}
    </div>
  );
