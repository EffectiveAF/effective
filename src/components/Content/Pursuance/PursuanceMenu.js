import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { ButtonGroup } from 'react-bootstrap';
import PursuanceMenuItem from './PursuanceMenuItem';
import TiFlowChildren from 'react-icons/lib/ti/flow-children';
import FaCheckSquareO from 'react-icons/lib/fa/check-square-o';
import FaCalendar from 'react-icons/lib/fa/calendar';
import Info from 'react-icons/lib/fa/info-circle';
// import FaSitemap from 'react-icons/lib/fa/sitemap';
import CommentsO from 'react-icons/lib/fa/comments-o';
// import Planet from 'react-icons/lib/io/planet';
// import FolderOpen from 'react-icons/lib/fa/folder-open';
// import Group from 'react-icons/lib/fa/group';
// import Rocket from 'react-icons/lib/fa/rocket';
// import PlusCircle from 'react-icons/lib/fa/plus-circle';
import './PursuanceMenu.css';

const PursuanceMenu = () => {
  return (
    <ButtonGroup vertical className="pursuance-btn-group hide-xsmall">
      <div>
        <PursuanceMenuItem
          className="pursuance-top-btn"
          label='About'
          action='about'
          icon={<Info size={28} />}
        />
        {/*
        <PursuanceMenuItem
          className="pursuance-top-btn"
          label='New'
          action='add'
          icon={<PlusCircle size={28} />}
        />
        */}
        <PursuanceMenuItem
          label='Discuss'
          action='discuss'
          icon={<CommentsO size={28} />}
        />
        <PursuanceMenuItem
          label='My Tasks'
          action='my_tasks'
          icon={<FaCheckSquareO size={28} />}
        />
        <PursuanceMenuItem
          label='All Tasks'
          action='tasks'
          icon={<TiFlowChildren size={28} />}
        />
        <PursuanceMenuItem
          className="pursuance-bottom-btn"
          label='Calendar'
          action='calendar'
          icon={<FaCalendar size={28} />}
        />
        {/*
        <PursuanceMenuItem
          label='Roles'
          action='roles'
          icon={<FaSitemap size={28} />}
        />
        <PursuanceMenuItem
          label='All Members'
          action='tasks'
          icon={<TiFlowChildren size={28} />}
        />
        <PursuanceMenuItem
          label='Files & Docs'
          action='docs'
          icon={<FolderOpen size={28} />}
        />
        <PursuanceMenuItem
          label='Participants'
          action='participants'
          icon={<Group size={28} />}
        />
        <PursuanceMenuItem
          className="pursuance-bottom-btn"
          label='Progress'
          action='progress'
          icon={<Rocket size={28} />}
        />
        <PursuanceMenuItem
          label='Members'
          action='members'
          icon={<Group size={28} />}
        />
        <PursuanceMenuItem
          label='Universe'
          action='universe'
          icon={<Planet size={28} />}
        />
        */}
      </div>
    </ButtonGroup>
  );
};

export default withRouter(connect(null)(PursuanceMenu));
