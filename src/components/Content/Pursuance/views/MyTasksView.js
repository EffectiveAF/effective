import React from 'react';
import MyTasks from '../../MyTasks/MyTasks';

const MyTasksView = ({ match: { params: { pursuanceId } } }) => {
  return (
    <MyTasks pursuanceId={pursuanceId} />
  );
};

export default MyTasksView;
