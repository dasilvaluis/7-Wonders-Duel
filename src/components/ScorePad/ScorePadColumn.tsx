import { PlayerScore } from "./ScorePad"
import React from "react"
import ScorePadInput from "./ScorePadInput"
import ScorePadCheckbox from "./ScorePadCheckbox"

interface Props {
  score: PlayerScore;
  onUpdate(type: string, value: number | boolean): void;
}

export default ({
  score,
  onUpdate
}: Props) => {
  const handleInputChange = (type: string) => (value: number) => {
    onUpdate(type, value);
  }

  const handleCheckboxChange = (type: string) => (checked: boolean) => {
    onUpdate(type, Number(checked));
  }

  const total = Object.values(score).reduce((acc, curr) => 
    typeof curr === 'number' ? acc + curr : acc, 0);

  return (
    <div className="score-pad__column">
      <ScorePadInput type="civilisation" value={score.civilisation} onChange={handleInputChange('civilisation')} />
      <ScorePadInput type="science" value={score.science} onChange={handleInputChange('science')} />
      <ScorePadInput type="commerce" value={score.commerce} onChange={handleInputChange('commerce')} />
      <ScorePadInput type="guild" value={score.guild} onChange={handleInputChange('guild')} />
      <ScorePadInput type="wonder" value={score.wonder} onChange={handleInputChange('wonder')} />
      <ScorePadInput type="progress" value={score.progress} onChange={handleInputChange('progress')} />
      <ScorePadInput type="money" value={score.money} onChange={handleInputChange('money')} />
      <ScorePadInput type="military" value={score.military} onChange={handleInputChange('military')} />
      <ScorePadInput type="total" value={total} disabled={true} />
      <ScorePadCheckbox type="suddendeathMilitary" checked={score.suddendeathMilitary} onChange={handleCheckboxChange('suddendeathMilitary')} />
      <ScorePadCheckbox type="suddendeathScience" checked={score.suddendeathScience} onChange={handleCheckboxChange('suddendeathScience')} />
    </div>
  )
}