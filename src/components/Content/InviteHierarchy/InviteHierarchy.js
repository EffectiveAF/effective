import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getTasks,
  getPursuances,
  getMemberships,
} from '../../../actions';
import Member from '../MemberHierarchy/Member.js';
import './InviteHierarchy.css';
//import '../Content.css';

class InviteHierarchy extends Component {

  componentWillMount() {
    const {
      getPursuances,
      getTasks,
      getMemberships,
      currentPursuanceId,
      pursuances,
      tasks,
      memberships,
    } = this.props;

    // Fetch this pursuance's memberships if we haven't already
    if (Object.keys(memberships.membershipMap)
        .filter(user_username__pursuance_id => {
          return user_username__pursuance_id.endsWith('_' + currentPursuanceId);
        })
        .length <= 1) {
      getMemberships({ pursuance_id: currentPursuanceId });
    }

    // Fetch this pursuance's tasks if we haven't already
    if (Object.keys(tasks.taskMap)
        .filter(gid => gid.startsWith(currentPursuanceId + '_'))
        .length === 0) {
      getTasks(currentPursuanceId);
    }
    if (Object.keys(pursuances).length === 0) {
      getPursuances();
    }
  }

  _getRoles = () => {
    const { currentPursuanceId, memberships } = this.props;
    const localMembershipIds = Object.keys(memberships.membershipMap)
      .filter((user_username__pursuance_id) => {
        return user_username__pursuance_id.endsWith('_' + currentPursuanceId);
      })
    let mship;
    const rootMembershipIds = [];
    for (let i = 0; i < localMembershipIds.length; i++) {
      mship = memberships.membershipMap[localMembershipIds[i]];
      if (!mship.invited_by) {
        rootMembershipIds.push(mship.id);
        // break;
      }
    }

    return {
      rootMembershipIds,
      localMembershipIds,
    }
  }

  getInviteHierarchy = () => {
    const { memberships } = this.props;
    const { rootMembershipIds, localMembershipIds } = this._getRoles();
    return rootMembershipIds.map(id => {
      const rootMember = memberships.membershipMap[id];
      return (
        <Member
          key={id}
          membership={rootMember}
          membershipMap={memberships.membershipMap}
          localMembershipIds={localMembershipIds}
        />
      )
    })
  }

  render() {
    // const { pursuances, currentPursuanceId } = this.props;
    const inviteHierarchy = this.getInviteHierarchy();

    return (
      <div>
        <div id="calendar">
          <div id="task-hierarchy-title">
            <h3>All Members</h3>
            {/*<h2 id="pursuance-title">
              {
                pursuances[currentPursuanceId] && pursuances[currentPursuanceId].name
              }
            </h2>
            */}
            <br />
            <div id="task-labels">
              <div>
                <span>
                  Username
                </span>
              </div>
              <div className="label-task-icons">
                <span>

                </span>
              </div>
              <div className="label-status hide-small">
                <span>
                </span>
              </div>
              <div className="label-assigned-to hide-small">
                <span>
                  Permissions Level
                </span>
              </div>
              <div className="label-due-date hide-small">
                <span>
                  Joined
                </span>
              </div>
            </div>
          </div>
          <div id="invite-tree">
            <ul className="ul-ctn">
              {inviteHierarchy}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ pursuances, currentPursuanceId, tasks, user, memberships }) =>
  ({ pursuances, currentPursuanceId, tasks, user, memberships }), {
    getTasks,
    getPursuances,
    getMemberships,
})(InviteHierarchy);
