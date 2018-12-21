import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import {
  getPursuances,
  getInvites,
  rpShowTaskDetails,
  toggleRoleInfoModal,
} from '../../../actions';
import FaQuestionCircle from 'react-icons/lib/fa/question-circle';
import FaChain from 'react-icons/lib/fa/chain';
import FaTimesCircleO from 'react-icons/lib/fa/times-circle-o';
import FaCommentsO from 'react-icons/lib/fa/comments-o';
import FaVideoCamera from 'react-icons/lib/fa/video-camera';
import { ToastContainer, toast } from 'react-toastify';
import RoleInfoModal from './RoleInfoModal/RoleInfoModal';
import InviteHierarchy from '../InviteHierarchy/InviteHierarchy.js';
import { VALID_PERMISSIONS_LEVELS } from '../MemberHierarchy/MemberPermissionsLevel.js';
import 'react-toastify/dist/ReactToastify.css';
import './Invite.css';
import '../Content.css';

class Invite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: [],
      interests: [],
      invitesSent: {},
    }
  }

  componentDidMount() {
    const { getPursuances, getInvites, currentPursuanceId, pursuances } = this.props;
    if (!pursuances[currentPursuanceId]) {
      getPursuances();
    }

    getInvites({pursuanceId: currentPursuanceId});
  }

  skillInput = (e) => {
    const { target: { value } } = e;
    this.setState({ skills: value.split(/[ ,]+/)});
  }

  interestInput = (e) => {
    const { target: { value } } = e;
    this.setState({ interests: value.split(/[ ,]+/)});
  }

  getInvitesFromRedux = () => {
    // TEMPORARY(elimisteve): See below
    // const { currentPursuanceId, invites } = this.props;
    const { invites } = this.props;
    return Object.keys(invites)
      // TEMPORARY(elimisteve): Post-Kickstarter demo, re-add this filter line
      // .filter((id) => invites[id].pursuance_id === currentPursuanceId && id)
      .filter((id) => id)
      .map((id) => invites[id])
  }

  displayProfile = (profile) => {
    const { skills, interests } = this.state;
    const notMatchingSkills = skills.every(skill => (
      profile.skills.some(term => { return term.toLowerCase().includes(skill.toLowerCase()) })
    ));
    const notMatchingInterests = interests.every(interest => (
      profile.interests.some(term => { return term.toLowerCase().includes(interest.toLowerCase()) })
    ));
    return notMatchingSkills && notMatchingInterests;
  }

  inviteSent = (profileId) => {
    this.setState({
      invitesSent: {
        [profileId]: true,
        ...this.state.invitesSent
      }
    })
  }

  displayRecruitSearchResults = () => {
    const { publicProfiles } = this.props;
    const { invitesSent } = this.state;
    let numMatches = 0;
    const results = publicProfiles.map(profile => {
      if (this.displayProfile(profile)) {
        numMatches++;
        return (
          <div className="profile" key={profile.id}>
            <div>
              <div className="profile-name-ctn">
                <strong className="profile-username">@{profile.username}</strong>
                <FaCommentsO size={34} className="icon" style={{marginTop: '0px'}} />
                <FaVideoCamera size={34} className="icon" style={{marginTop: '0px'}} />
              </div>
              <ul><strong>Skills:</strong>{profile.skills.map(skill => (<li key={skill}>{skill}</li>))}</ul>
              <ul><strong>Interests:</strong>{profile.interests.map(interest => (<li key={interest}>{interest}</li>))}</ul>
            </div>
            <div>
              {this.displayPermissionsSelect('Trainee')}
              {invitesSent[profile.id] && (
                <button
                  className="btn btn-danger"
                >
                  Cancel Invitation
                </button>
              )}
              {!invitesSent[profile.id] && (
                <button
                  className="btn btn-primary"
                  onClick={() => this.inviteSent(profile.id)}
                >
                  Send Invitation
                </button>
              )}
            </div>
          </div>
        );
      }
      return null;
    });
    return {
      numMatches,
      results,
    }
  }

  displayPermissionsSelect = (defaultLevel = 'Contributor') => {
    return (
      <select defaultValue={defaultLevel} style={{borderRadius: 3, paddingLeft: 4, height: 36, lineHeight: 36}}>
        {VALID_PERMISSIONS_LEVELS.map(level =>
          <option key={level} value={level}>{level}</option>
        )}
      </select>
    )
  }

  displayExpireSelect = () => {
    return (
      <select defaultValue="14d">
        <option value="10m">10 minutes</option>
        <option value="1d">1 day</option>
        <option value="7d">7 days</option>
        <option value="14d">14 days</option>
        <option value="30d">30 days</option>
        <option value="never">Never</option>
      </select>
    )
  }

  sortByCreated = (tlist1, tlist2) => {
    // return new Date(tlist1.created) < new Date(tlist2.created);
    return tlist1.id < tlist2.id;
  }

  displayRoleSelect = () => {
    const { currentPursuanceId, taskLists } = this.props;
    const roles = Object.values(taskLists.taskListMap)
      .filter(taskList => {
        return taskList.is_role && taskList.pursuance_id === currentPursuanceId &&
          !taskList.assigned_to_pursuance_id && !taskList.assigned_to;
      })
      .map(taskList =>
        <option key={taskList.id} value={taskList.id}>{taskList.name}</option>
      )
    roles.sort(this.sortByCreated);
    return (
      <select>
        <option value={null}></option>
        {roles}
      </select>
    )
  }

  addInviteUrlToClipboard = () => {
    toast.success('Added invite URL to clipboard!');
  }

  createInvite = () => {
  }

  displayInvites = (invites) => {
    return invites.map((invite) => {
      return (
        <div key={invite.id} className='invite-link'>
          <div className="invite-purpose">
            {invite.purpose}
          </div>
          <div className="invite-permissions-level">
            <span className='title'>Permissions Level:</span>
            <span className='value'>{invite.permissions_level.replace(/([a-z])([A-Z])/g, "$1 $2")}</span>
          </div>
          <div className="invite-copy-link">
            <button
              className="btn btn-primary"
              onClick={this.addInviteUrlToClipboard}
            >
              Copy Link&nbsp;
              {<FaChain size={16} />}
            </button>
            <button
              className="btn btn-success"
              onClick={this.addInviteUrlToClipboard}
            >
              Copy Tor Link&nbsp;
              {<FaChain size={16} />}
            </button>
            <ToastContainer
              position="top-center"
              type="success"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
            />
          </div>
          <div className="invite-delete-btn">
            <button
              className="btn btn-danger"
            >
              Delete&nbsp;
              {<FaTimesCircleO size={16} />}
            </button>
          </div>
        </div>
      )
    })
  }

  render() {
    const { pursuances, currentPursuanceId, toggleRoleInfoModal } = this.props;
    const invites = this.getInvitesFromRedux();
    const searchResults = this.displayRecruitSearchResults();

    return (
      <div className="content">
        <div id="invites">
          <div id="task-hierarchy-title">
            <h2 id="invite-title">Invite others to:&nbsp;</h2>
            <h2 id="pursuance-title">
              {
                pursuances[currentPursuanceId] && pursuances[currentPursuanceId].name
              }
            </h2>
          </div>
          <Tabs defaultActiveKey={0} id="invite-tabs">
            <Tab eventKey={0} title="Members" className="invite-hierarchy">
              <InviteHierarchy
                pursuanceId={currentPursuanceId}
              />
            </Tab>

            <Tab eventKey={1} title="Create Invite Links" className="invite-links">
              <h3>Create New Invite Link</h3>
              <div id="invites-form">
                <input
                  type="text"
                  placeholder="For co-workers"
                  autoFocus
                />
                <div className="invites-invite-as">
                  <label>Permissions:</label>
                  {this.displayPermissionsSelect()}
                  <div className='hint' onClick={toggleRoleInfoModal}>
                    {<FaQuestionCircle size={20} />}
                  </div>
                </div>
                <div className="invites-role">
                  <label>Invite into role:</label>
                  {this.displayRoleSelect()}
                </div>
                <div className="invites-expire">
                  <label>Invite link expires after:</label>
                  {this.displayExpireSelect()}
                </div>
                <button
                  className="btn btn-success"
                  onClick={this.createInvite}
                >
                  Create
                </button>
              </div>
              <div id="invite">
                <h3>Invite Links Created</h3>
                <div className="invite-links">
                  {this.displayInvites(invites)}
                </div>
              </div>
            </Tab>

            <Tab eventKey={2} title="Recruit by Skill Set" className="recruit">
              <div className="recruit-title">
                <h3>Recruit Volunteers by their Skill Set and Interests</h3>
              </div>
              <div id="recruit-form-skills">
                <label>Skills:</label>
                <input
                  type="text"
                  placeholder="Research Programming:React"
                  autoFocus
                  onChange={this.skillInput}
                />
              </div>
              <div id="recruit-form-interests">
                <label>Interests:</label>
                <input
                  type="text"
                  placeholder="PrisonReform Abortion:ProChoice"
                  onChange={this.interestInput}
                />
              </div>
              <br />
              <div className="recruit-title row" style={{display: 'flex', width: '60vw'}}>
                <div className="col-sm-9">
                  <h4>Search Results: {searchResults.numMatches}</h4>
                </div>
                <div className="col-sm-3" style={{borderRadius: 3, margin: 'auto'}}>
                  {this.displayPermissionsSelect('Trainee')}
                  <button
                    className="btn btn-success"
                    onClick={this.createInvite}
                  >
                    Invite All
                  </button>
                </div>
              </div>
              <div className="recruit-search-results">
                {searchResults.results}
              </div>
            </Tab>
          </Tabs>
          <RoleInfoModal />
        </div>
      </div>
    );
  }
}

export default connect(({ pursuances, currentPursuanceId, invites, publicProfiles, taskLists }) =>
  ({ pursuances, currentPursuanceId, invites, publicProfiles, taskLists }), {
    getPursuances,
    getInvites,
    rpShowTaskDetails,
    toggleRoleInfoModal,
})(Invite);
