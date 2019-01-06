import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import TiPencil from 'react-icons/lib/ti/pencil';
import Confetti from 'react-dom-confetti';
import { setTaskCelebrated } from '../../../actions';
import './TaskStatus.css';

const VALID_STATUSES = [
  'New',
  'Started',
  'WorkingOn',
  'HelpWanted',
  'ReadyForReview',
  'Reviewing',
  'Done'
];

const STATUS_IMAGES = {
  'WorkingOn': true,
}

class TaskStatus extends Component {

  displayStatus = (status) => {
    return status.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  getCurrentStatus = () => {
    return this.displayStatus(this.props.status);
  }

  getDropDownItems = () => {
    // eslint-disable-next-line
    return VALID_STATUSES.map((statusName, i) => {
      if (statusName !== this.props.status) {
        return (
          <MenuItem eventKey={i} key={statusName}
            onClick={() => this.selectStatus(statusName)}>
            {this.displayStatus(statusName)}
          </MenuItem>
        );
      }
    });
  }

  selectStatus = (status) => {
    const { gid, patchTask } = this.props;
    patchTask({ gid, status });
  }

  componentDidUpdate = () => {
    // Prevent showing multiple celebrations for single task completion
    // (when switching sidebar tasks, for example)
    const { showCelebration, gid } = this.props;
    if (showCelebration) this.props.setTaskCelebrated(gid);
  }

  render() {
    const { status, showCelebration, confettiConfig } = this.props;
    return (
      <div className={"task-status-ctn task-status-" + status + " hide-small"}>
        <Confetti active={showCelebration} config={confettiConfig}/>
        <DropdownButton
          id="task-status-dropdown"
          title={this.getCurrentStatus()}
          noCaret>
          {this.getDropDownItems()}
        </DropdownButton>
        {STATUS_IMAGES[status] && <img src={`/assets/img/${status}.gif`} alt={`Status: ${status}`} />}
        <div className="edit-icon-ctn">
          <TiPencil id="task-edit-icon" size={18} />
        </div>
      </div>
    )
  }
}

export default connect(() => ({}), { setTaskCelebrated })(TaskStatus);
