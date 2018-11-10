import React from 'react';
import RoleHierarchy from '../../RoleHierarchy/RoleHierarchy';

const RolesView = ({ match: { params: { pursuanceId } } }) => {
  return (
    <RoleHierarchy pursuanceId={pursuanceId} />
  );
};

export default RolesView;
