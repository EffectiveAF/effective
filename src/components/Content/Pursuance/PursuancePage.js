import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { setCurrentPursuance } from '../../../actions';
import PursuanceMenu from './PursuanceMenu';
import AboutView from './views/AboutView';
import MyTasksView from './views/MyTasksView';
import TaskListView from './views/TaskListView';
import CalendarView from './views/CalendarView';
import RolesView from './views/RolesView';
import InviteView from './views/InviteView';
import DiscussView from './views/DiscussView';
// import ParticipantsView from './views/ParticipantsView';
import UniverseView from './views/UniverseView';
import RightPanel from '../RightPanel/RightPanel';
import './PursuancePage.css';

class PursuancePage extends Component {

  componentWillMount() {
    let { setCurrentPursuance, match, currentPursuanceId } = this.props;
    currentPursuanceId = Number(match.params.pursuanceId) || currentPursuanceId;
    setCurrentPursuance(currentPursuanceId);
  }

  render() {
    return (
      <Router>
        <div id="pursuance-page" className="content-ctn">
          <nav id="pursuance-nav">
            <PursuanceMenu />
          </nav>
          <article>
            <Switch>
              <Route exact path="/pursuance/:pursuanceId/about" component={AboutView} />
              <Route exact path="/pursuance/:pursuanceId" component={TaskListView} />
              <Route exact path="/pursuance/:pursuanceId/my_tasks" component={MyTasksView} />
              <Route exact path="/pursuance/:pursuanceId/tasks" component={TaskListView} />
              <Route exact path="/pursuance/:pursuanceId/calendar" component={CalendarView} />
              <Route exact path="/pursuance/:pursuanceId/roles" component={RolesView} />
              <Route exact path="/pursuance/:pursuanceId/members" component={InviteView} />
              <Route exact path="/pursuance/:pursuanceId/discuss/task/:taskGid" component={DiscussView} />
              {/*<Route exact path="/pursuance/:pursuanceId/discuss/task_list/:taskListId" component={DiscussView} />*/}
              {/*<Route exact path="/pursuance/:pursuanceId/participants" component={ParticipantsView} />*/}
              <Route exact path="/pursuance/:pursuanceId/universe" component={UniverseView} />
            </Switch>
            <RightPanel />
          </article>
        </div>
      </Router>
    );
  }
}

export default connect(({currentPursuanceId}) =>
  ({ currentPursuanceId }), {
   setCurrentPursuance
})(PursuancePage);
