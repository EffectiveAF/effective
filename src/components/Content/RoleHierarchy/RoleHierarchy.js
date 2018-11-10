import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getTasks,
  getTaskLists,
  getPursuances,
  getMemberships,
} from '../../../actions';
import TaskList from '../TaskList/TaskList.js';
import './RoleHierarchy.css';
import '../Content.css';

class RoleHierarchy extends Component {

  componentWillMount() {
    const {
      getTasks,
      getTaskLists,
      currentPursuanceId,
      pursuances,
      tasks,
      taskLists,
    } = this.props;

    // Fetch this pursuance's tasks if we haven't already
    if (Object.keys(tasks.taskMap)
        .filter(gid => gid.startsWith(currentPursuanceId + '_'))
        .length === 0) {
      getTasks(currentPursuanceId);
    }

    // Fetch this pursuance's task lists if we haven't already
    if (Object.keys(taskLists.taskListMap)
        .filter(id => taskLists.taskListMap[id].pursuance_id === currentPursuanceId)
        .length === 0) {
      getTaskLists(currentPursuanceId, { is_role: true });
    }

    if (Object.keys(pursuances).length === 0) {
      getPursuances();
    }
  }

  _getRoles = () => {
    const { currentPursuanceId, taskLists } = this.props;
    const localRootTaskListIds = [];
    let tlist;
    const localTaskLists = Object.keys(taskLists.taskListMap)
      .filter(id => {
        tlist = taskLists.taskListMap[id];
        if (tlist.pursuance_id === currentPursuanceId && tlist.is_role) {
          if (!tlist.parent_task_list_id) {
            localRootTaskListIds.push(id);
          }
          return true;
        }
        return false;
      })

    return {
      localRootTaskListIds,
      localTaskLists,
    }
  }

  getRoleHierarchy = () => {
    const { taskLists } = this.props;
    const { localRootTaskListIds } = this._getRoles();
    return localRootTaskListIds.map(id => {
      return (
        <TaskList
          key={id}
          taskListId={id}
          taskList={taskLists.taskListMap[id]}
        />
      )
    })
  }

  render() {
    // const { pursuances, currentPursuanceId } = this.props;
    const roleHierarchy = this.getRoleHierarchy();

    return (
      <div>
        <div id="role-hierarchy">
          <div id="task-hierarchy-title">
            <h3>Member Roles</h3>
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
                  Role Title
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
                  Assigned To
                </span>
              </div>
              <div className="label-due-date hide-small">
                <span>
                  Due Date
                </span>
              </div>
            </div>
          </div>
          <div id="role-tree">
            <ul className="ul-ctn">
              {roleHierarchy}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ pursuances, currentPursuanceId, tasks, taskLists, user }) =>
  ({ pursuances, currentPursuanceId, tasks, taskLists, user }), {
    getTasks,
    getTaskLists,
    getPursuances,
    getMemberships,
})(RoleHierarchy);
