import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import TiPlus from 'react-icons/lib/ti/plus';
import TiMinus from 'react-icons/lib/ti/minus';
import MemberPermissionsLevel from './MemberPermissionsLevel';
import * as postgrest from '../../../api/postgrest';
import './Member.css';
import {
  setMembershipPermissionsLevel
} from '../../../actions';

class RawMember extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showChildren: true,
    };
  }

  toggleChildren = () => {
    this.setState({
      ...this.state,
      showChildren: !this.state.showChildren
    });
  }

  styleUl = () => {
    if (this.state.showChildren) {
      return { display: 'block' };
    } else {
      return { display: 'none' };
    }
  }

  mapSubMembers = (membership) => {
    const { memberships, localMembershipIds } = this.props;
    return membership.submember_ids.map((id) => {
      return (
        <Member
          key={id}
          membership={memberships.membershipMap[id]}
          membershipMap={memberships.membershipMap}
          localMembershipIds={localMembershipIds}
        />
      )
    });
  }

  getMemberIcon = (membership, showChildren) => {
    if (!membership.submember_ids || membership.submember_ids.length === 0) {
      return (
        <div className="toggle-icon-ctn-disable" />
      );
    } else if (showChildren) {
      return (
        <div className="toggle-icon-ctn" onClick={this.toggleChildren}>
          <TiMinus className="minus-icon" />
        </div>
      );
    } else {
      return (
        <div className="toggle-icon-ctn" onClick={this.toggleChildren}>
          <TiPlus className="plus-icon" />
        </div>
      );
    }
  }

  showTitle = (membership) => {
    if (membership.invited_by) {
      return (
        <div>@{membership.user_username}</div>
      );
    }
    // Bold top-level member(s) (should just be 1)
    return (
      <div>
        <strong>@{membership.user_username}</strong>
      </div>
    );
  }

  render() {
    // Manually passed in
    const { membership } = this.props;
    const { setMembershipPermissionsLevel } = this.props;
    const { showChildren } = this.state;

    return (
      <li className="li-task-ctn">
        <div className="task-ctn">
          <div className="toggle-ctn">
            {this.getMemberIcon(membership, showChildren)}
          </div>
          <div className="task-row-ctn">
            <div className="task-title">
              {this.showTitle(membership)}
            </div>
            <div className="task-title-buffer">
            </div>
            <div className="task-icons-ctn">
            </div>
            <MemberPermissionsLevel
              id={membership.id}
              permissions_level={membership.permissions_level}
              setMembershipPermissionsLevel={setMembershipPermissionsLevel}
            />
            <div className="task-due-date">
              {postgrest.formatDate(membership.created)}
            </div>
          </div>
        </div>
        {
          membership.submember_ids && membership.submember_ids.length > 0 &&
            <ul className="ul-ctn" style={this.styleUl()}>
              {this.mapSubMembers(membership)}
            </ul>
        }
      </li>
    );
  }
}

const Member = withRouter(connect(
  ({ pursuances, user, users, currentPursuanceId, rightPanel, memberships }) =>
   ({ pursuances, user, users, currentPursuanceId, rightPanel, memberships }), {
  setMembershipPermissionsLevel
})(RawMember));

// Why RawMember _and_ Member? Because Member.mapSubMembers() recursively
// renders Member components which weren't wrapped in a Redux connect()
// call (until calling the original component 'RawMember' and the
// wrapped component 'Member'), and thus `this.props` wasn't being
// populated by Redux within mapSubMembers(). More info:
// https://stackoverflow.com/a/37081592/197160
export default Member;
