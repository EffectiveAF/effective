import React from 'react';
import RolesHierarchy from '../../RolesHierarchy/RolesHierarchy';

const RolesHierarchyView = ({ match: { params: { pursuanceId } } }) => {
  return (
    <RolesHierarchy pursuanceId={pursuanceId} />
  );
};

export default RolesHierarchyView;
