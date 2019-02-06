import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Navbar, NavItem, Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import FaBell from 'react-icons/lib/fa/bell';
import SignUp from './SignUp/SignUp';
import LogIn from './LogIn/LogIn';
import NotificationsModal from './NotificationsModal/NotificationsModal';
import UserSettingsPopover from './UserSettingsPopover';
import Planet from 'react-icons/lib/io/planet';
import { PROJECT_CAPITAL, THIS_PROJECT_NAME } from '../../constants';
import JumpToPursuance from './JumpToPursuance/JumpToPursuance';
import './NavBar.css';

class NavBar extends Component {

  getTooltip = () => (
    <Tooltip id="tooltip-bell">
      <strong>Notifications</strong>
    </Tooltip>
  );

  render() {
    const { authenticated, username, contributionPoints } = this.props.user;
    return (
      <Navbar collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">{THIS_PROJECT_NAME}</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        {!authenticated && <LogIn />}
        <Navbar.Collapse>
          <ul className="nav navbar-nav">
            <li role="presentation">
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/pursuance/all">
                <Planet size={16} className="planet-icon"/>
                Explore {PROJECT_CAPITAL} Universe
              </Link>
            </li>
          </ul>
          <Nav pullRight>
            {
              !authenticated &&
              (
                <NavItem data-toggle="modal" data-target="#sign-up-modal">
                  Sign Up
                </NavItem>
              )
            }
            {!authenticated && <SignUp />}
            {
              !authenticated &&
              (
                <NavItem data-toggle="modal" data-target="#log-in-modal">
                  Log In
                </NavItem>
              )
            }
            {authenticated &&
              <JumpToPursuance history={this.props.history}/>
            }
            {
              authenticated &&
              (
                <OverlayTrigger
                  placement="bottom"
                  overlay={this.getTooltip()}>
                  <NavItem data-toggle="modal"
                    data-target="#notifications-modal">
                    <FaBell size={24} />
                  </NavItem>
                </OverlayTrigger>
              )
            }
            {
              authenticated &&
                <NotificationsModal
                  onIncreaseContributionAmount={this.props.onIncreaseContributionAmount}
                  onRemoveNotification={this.props.onRemoveNotification} />
            }
            {
              authenticated &&
              (
                <NavItem>
                  <UserSettingsPopover username={username} contributionPoints={contributionPoints} />
                </NavItem>
              )
            }
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(connect(({ user }) => ({ user }))(NavBar));
