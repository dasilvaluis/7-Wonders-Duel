import React from 'react';
import { AppState } from '../../reducers';
import { getMoney } from '../../reducers/selectors';
import { connect } from 'react-redux';
import './PlayerArea.scss';

interface OwnProps {
  playerName: string
}

interface StateProps {
  money: number
}

interface Props extends OwnProps, Partial<StateProps> {}

const PlayerArea: React.FC<Props> = (props: Props) => {

  return (
    <div className="playerarea">
      <div>Money: {props.money}</div>
      <div className="playerarea__tokens"></div>
      <div className="playerarea__wonders"></div>
      <div className="playerarea__deck"></div>
    </div>
  )
};


const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
  money: getMoney(state)
});

export default connect(
  mapStateToProps,
  null
)(PlayerArea);
