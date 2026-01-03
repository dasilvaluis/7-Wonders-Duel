import { type ChangeEvent } from 'react';

type Props = {
  type: string;
  value: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export default ({
  type,
  value,
  disabled,
  onChange
}: Props) => {
  const maximum_value = 200;

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    if (onChange && !disabled) {
      const value = evt.target.value !== ''
        ? parseInt(evt.target.value, 10)
        : 0;

      if (typeof value === 'number' && value <= maximum_value) {
        onChange(value);
      }
    }
  }

  return (
    <input
      type="number"
      value={value > 0 ? value : ''}
      disabled={disabled}
      onChange={handleChange}
      className={`score-pad__cell score-pad__input -${type}`}
    />
  );
}
