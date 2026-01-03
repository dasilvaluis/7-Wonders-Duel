import { type ChangeEvent } from 'react';

type Props = {
  type: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export default ({ type, checked, onChange }: Props) => {
  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    onChange(evt.target.checked);
  };

  return (
    <div className={`score-pad__cell score-pad__checkbox -${type}`}>
      <input type="checkbox" checked={checked} onChange={handleChange} />
    </div>
  );
};
