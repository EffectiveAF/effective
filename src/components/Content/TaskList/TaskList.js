import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import generateId from '../../../utils/generateId';
import { showAssignee, isRootTaskListInPursuance } from '../../../utils/tasks';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import TiPlus from 'react-icons/lib/ti/plus';
import TiMinus from 'react-icons/lib/ti/minus';
import TiFlowChildren from 'react-icons/lib/ti/flow-children';
import FaUserPlus from 'react-icons/lib/fa/user-plus';
import FaCommentsO from 'react-icons/lib/fa/comments-o';
import Task from '../TaskHierarchy/Task/Task.js';
import TaskForm from '../TaskManager/TaskForm/TaskForm';
import TaskListForm from './TaskListForm/TaskListForm.js';
import TaskAssigner from '../TaskHierarchy/Task/TaskAssigner/TaskAssigner';
import TaskDueDate from '../TaskDueDate/TaskDueDate';
import { filterSuggestion } from '../../../utils/suggestions';
import './TaskList.css';
import {
  addTaskListFormUnderParent,
  removeTaskListFormFromUnderParent,
  addTaskFormToEndOfTaskList,
  removeTaskFormFromEndOfTaskList,
  startSuggestions,
  rpShowTaskDetailsOrCollapse,
  patchTaskList
} from '../../../actions';

class RawTaskList extends Component {
  constructor(props) {
    super(props);

    // const { user, taskList } = props;
    const { isSynthetic = false } = props;

    this.state = {
      // showChildren: user.username && user.username === taskList.assigned_to,
      showChildren: isSynthetic
    };
  }

  toggleChildTasks = () => {
    this.setState({
      showChildren: !this.state.showChildren
    });
  }

  toggleNewTaskForm = () => {
    const {
      taskList,
      addTaskFormToEndOfTaskList,
      removeTaskFormFromEndOfTaskList,
    } = this.props;

    if (!taskList.subtaskform_id) {
      addTaskFormToEndOfTaskList(taskList.id, generateId('task'));
    } else {
      removeTaskFormFromEndOfTaskList(taskList.id, taskList.subtaskform_id);
    }
  }

  toggleNewRoleForm = () => {
    const {
      taskList,
      addTaskListFormUnderParent,
      removeTaskListFormFromUnderParent
    } = this.props;

    if (!taskList.subtasklistform_id) {
      addTaskListFormUnderParent(taskList.id, generateId('taskList'));
    } else {
      removeTaskListFormFromUnderParent(taskList.id, taskList.subtasklistform_id);
    }
  }

  redirectToDiscuss = () => {
    const { history, taskListId, match: { params: { pursuanceId } } } = this.props;
    history.push({
      pathname: `/pursuance/${pursuanceId}/discuss/task/${taskListId}`
    });
  }

  styleUl = () => {
    if (this.state.showChildren) {
      return { display: 'block' };
    } else {
      return { display: 'none' };
    }
  }

  mapSubTaskLists = (parentTaskList) => {
    const { autoComplete, tasks, taskLists, taskForm } = this.props;
    return parentTaskList.subtasklist_ids.map((id) => {
      const taskList = taskLists.taskListMap[id];
      if (!taskList) {
        return null;
      }
      return (
          <TaskList
            key={id}
            taskListId={id}
            taskList={taskList}
            taskMap={tasks.taskMap}
            autoComplete={autoComplete}
            taskForm={taskForm}
          />
      )
    });
  }

  getTaskListIcon = (taskList, showChildren) => {
    if (showChildren) {
      return (
        <div className="toggle-icon-ctn" onClick={this.toggleChildTasks}>
          <TiMinus className="minus-icon" />
        </div>
      );
    } else {
      return (
        <div className="toggle-icon-ctn" onClick={this.toggleChildTasks}>
          <TiPlus className="plus-icon" />
        </div>
      );
    }
  }

  onFocus = (e) => {
    const { users, pursuances, startSuggestions, currentPursuanceId, taskList } = this.props;
    const suggestions = Object.assign({}, pursuances, users);
    delete suggestions[currentPursuanceId];
    startSuggestions(e.target.value, filterSuggestion, suggestions, taskList.id);
  }

  showName = (taskList) => {
    const { currentPursuanceId } = this.props;

    if (!isRootTaskListInPursuance(taskList, currentPursuanceId)) {
      return (
        <div>{taskList.name}</div>
      );
    }
    // Bold top-level taskLists
    return (
      <div>
        <strong>{taskList.name}</strong>
      </div>
    );
  }

  getTooltip = (taskList, icon) => {
    const typeName = taskList.is_role ? 'Role' : 'Task List';

    if (icon === 'create-role') {
      return (
        <Tooltip id="tooltip-create-role">
          <strong>Create {typeName}</strong>
        </Tooltip>
      );
    } else if (icon === 'hands-down') {
      return (
        <Tooltip id="tooltip-hands-down">
          <strong>Add Task to {typeName}</strong>
        </Tooltip>
      );
    } else if (icon === 'chat') {
      return (
        <Tooltip id="tooltip-chat">
          <strong>Discuss {typeName}</strong>
        </Tooltip>
      );
    }
  }

  showPercentageCompleted = () => {
    const { taskList, tasks: { taskMap } } = this.props;
    const numTasks = taskList.task_gids.length;
    const numDone = taskList.task_gids.filter(gid => {
      return taskMap[gid] && taskMap[gid].status === 'Done';
    }).length;
    if (numTasks === 0) {
      return '';
    }
    return (numDone + '/' + numTasks) + ' (' +
      String(100 * numDone / numTasks).slice(0, 5) + '%)';
  }

  render() {
    const { pursuances, taskList, currentPursuanceId, tasks, isSynthetic } = this.props;
    const { showChildren } = this.state;
    const { placeholder, assignedTo } = showAssignee(
      taskList, currentPursuanceId, pursuances
    );

    return (
      <li className={"li-task-ctn li-tasklist-ctn in-task-list " +
                     (isSynthetic ? 'synthetic-tasklist' : '')}>
        {!isSynthetic && (
        <div className={'task-ctn'}>
          <div className="toggle-ctn">
            {this.getTaskListIcon(taskList, showChildren)}
          </div>
          <div className="task-row-ctn">
            <div className="task-title">
              {this.showName(taskList)}
            </div>
            <div className="task-title-buffer">
            </div>
            <div className="task-status-ctn">
              {this.showPercentageCompleted()}
            </div>
            <div className="task-icons-ctn in-task-list">
              <OverlayTrigger
                placement="bottom"
                overlay={this.getTooltip(taskList, 'create-role')}
              >
                <div id={'create-role-' + taskList.id} className="icon-ctn create-role" onClick={this.toggleNewRoleForm}>
                  <FaUserPlus size={20} />
                </div>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={this.getTooltip(taskList, 'hands-down')}
              >
                <div id={'create-subtask-' + taskList.id} className="icon-ctn create-subtask" onClick={this.toggleNewTaskForm}>
                  <TiFlowChildren size={20} />
                </div>
              </OverlayTrigger>

              <OverlayTrigger
                placement="bottom"
                overlay={this.getTooltip(taskList, 'chat')}
              >
                <div id={'discuss-task-' + taskList.id} className="icon-ctn discuss-task hide-small" onClick={this.redirectToDiscuss}>
                  <FaCommentsO size={20} />
                </div>
              </OverlayTrigger>
            </div>
            <div className="task-assigned-to hide-small">
              <TaskAssigner
                taskListId={taskList.id}
                taskListGid={taskList.gid}
                placeholder={placeholder}
                assignedTo={assignedTo}
              />
            </div>
            <TaskDueDate
              isInTaskList={true}
              id={taskList.id}
              taskList={taskList}
              autoFocus={true}
              patchTaskList={this.props.patchTaskList}
             />
          </div>
          )}
        </div>
        )}
        {
          showChildren && taskList.task_gids && taskList.task_gids.length > 0 &&
            <ul className="tasklist-ul-ctn" style={this.styleUl()}>
              {taskList.task_gids.map(gid => {
                return (
                  <Task
                    isInTaskList={true}
                    isInSyntheticTaskList={isSynthetic}
                    key={gid}
                    taskData={tasks.taskMap[gid]}
                    taskMap={tasks.taskMap}
                  />
                )
              })}
            </ul>
        }
        {(taskList.subtaskform_id || showChildren) && (
            <TaskForm
              isInTaskList={true}
              key={taskList.id}
              id={taskList.subtaskform_id}
              autoFocus={false}
              containingTaskList={taskList} />
        )}
        {
          taskList.subtasklist_ids && taskList.subtasklist_ids.length > 0 &&
            <ul className="ul-ctn">
              {this.mapSubTaskLists(taskList)}
            </ul>
        }
        {taskList.subtasklistform_id && <TaskListForm
                                          isInTaskList={true}
                                          key={taskList.subtasklistform_id}
                                          parentTaskListId={taskList.id}
                                          id={taskList.subtasklistform_id} />}
      </li>
    );
  }
}

const TaskList = withRouter(connect(
  ({ pursuances, user, users, currentPursuanceId, autoComplete, tasks, taskLists }) =>
   ({ pursuances, user, users, currentPursuanceId, autoComplete, tasks, taskLists }), {
  addTaskListFormUnderParent,
  removeTaskListFormFromUnderParent,
  addTaskFormToEndOfTaskList,
  removeTaskFormFromEndOfTaskList,
  startSuggestions,
  rpShowTaskDetailsOrCollapse,
  patchTaskList
})(RawTaskList));

// Why RawTaskList _and_ TaskList? Because TaskList.mapSubTaskLists() recursively
// renders TaskList components which weren't wrapped in a Redux connect()
// call (until calling the original component 'RawTaskList' and the
// wrapped component 'TaskList'), and thus `this.props` wasn't being
// populated by Redux within mapSubTaskLists(). More info:
// https://stackoverflow.com/a/37081592/197160
export default TaskList;
