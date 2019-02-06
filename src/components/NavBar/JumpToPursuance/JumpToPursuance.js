import React from 'react';
import { connect } from 'react-redux';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { setCurrentPursuance } from '../../../actions';
import { PROJECT } from '../../../constants';

class JumpToPursuance extends React.Component {

  getCurrentPursuanceName = (pursuances, currentPursuanceId) => {
    const rawPursuance = pursuances[currentPursuanceId];
    if (rawPursuance !== undefined) {
      return rawPursuance.name;
    } else {
      return "Jump to a " + PROJECT;
    }
  }

  produceOptions = (pursuances) => {
    const pursuanceArr = Object.values(pursuances);
    pursuanceArr.sort((p1, p2) => {
      return p1.name.toLowerCase().localeCompare(p2.name.toLowerCase());
    });

    return pursuanceArr.map((pursuance) => (
      <MenuItem
        key={pursuance.id}
        eventKey={pursuance.id}
        value={pursuance.id}
      >
        {pursuance.name}
      </MenuItem>
    ));
  }

  onMenuItemSelectAction = (pursuanceId) => {
    const { history, setCurrentPursuance } = this.props;
    history.push({
      pathname: `/pursuance/${pursuanceId}`
    });
    setCurrentPursuance(pursuanceId);
  }

  render() {
    const { pursuances, currentPursuanceId } = this.props;

    return (
      <li className="nav-pursuances noselect">
        <DropdownButton
          id="header-pursuance-dropdown"
          title={this.getCurrentPursuanceName(pursuances, currentPursuanceId)}
          onSelect={this.onMenuItemSelectAction}
        >
          {this.produceOptions(pursuances)}
        </DropdownButton>
      </li>
    )
  }
}

export default connect(
  ({currentPursuanceId, pursuances}) => ({currentPursuanceId, pursuances}),
  { setCurrentPursuance }
)(JumpToPursuance);
