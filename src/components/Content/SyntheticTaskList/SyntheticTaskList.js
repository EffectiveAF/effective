import React, { Component } from 'react';
import generateId from '../../../utils/generateId';
import TaskList from '../TaskList/TaskList';


class SyntheticTaskList extends Component {
  constructor(props) {
    super(props);

    this.id = generateId('syntheticTaskList');
  }

  render() {
    const { taskGids } = this.props;
    const taskList = {
      id: this.id,
      name: 'Unified Task List',
      task_gids: taskGids,
      is_role: false,
    };

    return (
      <TaskList
        isSynthetic={true}
        taskList={taskList}
      />
    )
  }
}

export default SyntheticTaskList;
