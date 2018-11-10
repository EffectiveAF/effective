import React, { Component } from 'react';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import TiPencil from 'react-icons/lib/ti/pencil';
import './MemberPermissionsLevel.css';


const VALID_PERMISSIONS_LEVELS = [
  'Admin',       /* view, create, assign, archive, invite, suspend, ban, delete */
  'AsstAdmin',   /* view, create, assign, archive, invite, suspend */
  'Recruiter',   /* view, create, assign, archive, invite */
  'Assigner',    /* view, create, assign, archive */
  'Contributor', /* view all tasks/task_lists, edit (parts of?) ones they're assigned */
  'Trainee'      /* view, work on just the tasks/task_lists they're assigned */
];

class MemberPermissionsLevel extends Component {

  displayLevel = (permissions_level) => {
    return permissions_level.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  getCurrentLevel = () => {
    return this.displayLevel(this.props.permissions_level);
  }

  getDropDownItems = () => {
    // eslint-disable-next-line
    return VALID_PERMISSIONS_LEVELS.map((level, i) => {
      if (level !== this.props.level) {
        return (
          <MenuItem eventKey={i} key={level}
            onClick={() => this.selectLevel(level)}>
            {this.displayLevel(level)}
          </MenuItem>
        );
      }
    });
  }

  selectLevel = (permissions_level) => {
    const { id, setMembershipPermissionsLevel } = this.props;
    setMembershipPermissionsLevel({ id, permissions_level });
  }

  render() {
    const { id, permissions_level } = this.props;
    return (
      <div key={id} className={"task-status-ctn member-level-" + permissions_level}>
        <DropdownButton
          id="task-status-dropdown"
          title={this.getCurrentLevel()}
          noCaret
        >
          {this.getDropDownItems()}
        </DropdownButton>
        <div className="edit-icon-ctn">
          <TiPencil id="task-edit-icon" size={18} />
        </div>
      </div>
    )
  }
}

export default MemberPermissionsLevel;
