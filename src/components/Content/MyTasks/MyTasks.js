import React, { Component } from 'react';
import { connect } from 'react-redux';
// import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import SyntheticTaskList from '../SyntheticTaskList/SyntheticTaskList';
import {
  rpShowTaskDetails,
  getUsers,
  getTasks,
  getPursuances,
} from '../../../actions';
import './MyTasks.css';
import '../Content.css';

// const DUE_DATE_DAYS_PER_HIERARCHY_LEVEL = -2;

class MyTasks extends Component {

  componentDidMount() {
    const { getPursuances, getUsers, getTasks, currentPursuanceId, pursuances } = this.props;
    getUsers();
    getTasks(currentPursuanceId);
    if (Object.keys(pursuances).length === 0) {
      getPursuances();
    }
  }

  getSortedTaskGids = () => {
    const { user, tasks, currentPursuanceId } = this.props;
    const myTasks = Object.values(tasks.taskMap).filter(task => {
      return currentPursuanceId === task.pursuance_id &&
        task.assigned_to && task.assigned_to === user.username &&
        task.status !== 'Done' && task.status !== 'ReadyForReview';
    })
    myTasks.sort(this._sortByAncestorDueDateParsed);
    return myTasks.map(task => task.gid);
  }

  _sortByAncestorDueDateParsed = (t1, t2) => {
    const t1EstimatedDueDateParsed = this._estimatedDueDate(t1);
    const t2EstimatedDueDateParsed = this._estimatedDueDate(t2);

    if (!t1EstimatedDueDateParsed && t2EstimatedDueDateParsed) {
      return 10000;
    } else if (t1EstimatedDueDateParsed && !t2EstimatedDueDateParsed) {
      return -10000;
    }
    if (!t1EstimatedDueDateParsed && !t2EstimatedDueDateParsed) {
      return 0;
    }
    if (t1EstimatedDueDateParsed === t2EstimatedDueDateParsed) {
      // TODO: Order by t.created timestamp... probably
    }
    return t1EstimatedDueDateParsed - t2EstimatedDueDateParsed;
  }

  _estimatedDueDate = (t) => {
    if (t.estimatedDueDateParsed) {
      return t.estimatedDueDateParsed;
    }

    const { tasks } = this.props;
    let estimatedDueDateParsed = null;
    if (t.due_date) {
      estimatedDueDateParsed = new Date(t.due_date);
    } else {
      let levelsUp = 0;
      let current = t;
      let ancestor;
      while (true) {
        levelsUp++;
        ancestor = tasks.taskMap[current.parent_task_gid];
        if (!ancestor) {
          break;
        }
        if (ancestor.due_date) {
          estimatedDueDateParsed = this._addDays(
            new Date(ancestor.due_date),
            (levelsUp + 1) * (levelsUp + 1) - 2
            // levelsUp * DUE_DATE_DAYS_PER_HIERARCHY_LEVEL
          );
          break;
        }

        current = ancestor;
      }
    }

    t.estimatedDueDateParsed = estimatedDueDateParsed;
    return estimatedDueDateParsed;
  }

  _addDays = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  render() {
    const { pursuances, currentPursuanceId } = this.props;
    const taskGids = this.getSortedTaskGids();

    return (
      <div className="content">
        <div id="invites">
          <div id="task-hierarchy-title">
            <h2 id="invite-title">My Tasks:&nbsp;</h2>
            <h2 id="pursuance-title">
              {
                pursuances[currentPursuanceId] && pursuances[currentPursuanceId].name
              }
            </h2>
          </div>
          {/*
          <Tabs defaultActiveKey={0} id="unified-tasks">
          */}
            <Tab eventKey={0} title="Unified" className="invite-hierarchy">
              <div>
                <h3>Unified Task List</h3>
                <SyntheticTaskList
                  taskGids={taskGids}
                />
              </div>
            </Tab>

            {/*
            <Tab eventKey={1} title="My Roles" className="invite-links">
              <h3>My Roles</h3>
              <div id="invite">
                TODO: My role task lists go here
              </div>
            </Tab>
            */}
          {/*
          </Tabs>
          */}
        </div>
      </div>
    );
  }
}

export default connect(({ pursuances, currentPursuanceId, tasks, taskLists, user }) =>
  ({ pursuances, currentPursuanceId, tasks, taskLists, user }), {
    rpShowTaskDetails,
    getUsers,
    getTasks,
    getPursuances,
})(MyTasks);
