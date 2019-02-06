import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as postgrest from '../../api/postgrest';
import { postMembership, getMemberships, deleteMembership } from '../../actions';
import { PROJECT, PROJECTS_CAPITAL } from '../../constants';
import './PublicPursuances.css';

class PublicPursuanceList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchByTag: '',
      searchByDescription: '' // TODO(elimisteve): actually use
    }
  }

  componentWillMount() {
    const { user, getMemberships } = this.props;
    getMemberships({ "user_username" : user.username });
  }

  sortByDateDesc = (p1, p2) => {
    p1["created_parsed"] = Date.parse(p1.created);
    p2["created_parsed"] = Date.parse(p2.created);
    return p2.created_parsed - p1.created_parsed;
  }

  sortByDateAsc = (p1, p2) => {
    return p1.created_parsed - p2.created_parsed;
  }

  sortByNameAsc = (p1, p2) => {
    return p1.name.toLowerCase().localeCompare(p2.name.toLowerCase());
  }

  sortByNameDesc = (p1, p2) => {
    return p2.name.toLowerCase().localeCompare(p1.name.toLowerCase());
  }

  sortBy = () => {
    switch(this.props.publicOrder) {
      case "Most Recent":
        return this.sortByDateDesc;
      case "Oldest":
        return this.sortByDateAsc;
      case "A to Z":
        return this.sortByNameAsc;
      case "Z to A":
        return this.sortByNameDesc;
      case "Most Popular":
        // function
        break;
      default:
        return this.sortByDateDesc;
    }
  }

  onChangeTag = (e) => {
    this.setState({
      searchByTag: e.target.value
    })
  }

  getPublicPursuanceList = () => {
    const { user, publicPursuances, postMembership, memberships, deleteMembership } = this.props;
    const pursuanceArr = Object.values(publicPursuances);
    pursuanceArr.sort(this.sortBy());
    return pursuanceArr.map((pursuance) => {
      if (pursuance.name.toLowerCase().indexOf(this.state.searchByTag) === -1 &&
          pursuance.mission.toLowerCase().indexOf(this.state.searchByTag) === -1) {
        return null;
      }
      return (
        <div key={pursuance.id} className="pursuance-list-ctn">
          <div className="pursuance-description">
            <Link to={`/pursuance/${pursuance.id}`}>
              <h3><strong>{pursuance.name}</strong></h3>
            </Link>
            <p><strong>Mission:</strong> {pursuance.mission}</p>
            <p>Created {postgrest.formatDate(pursuance.created)}</p>
          </div>
          <div className="pursuance-join">
            {
              user.authenticated
              &&
              !memberships.membershipMap[user.username + '_' + pursuance.id]
              &&
              <button
                className="join-btn pursuance-btn"
                onClick={() => postMembership({
                  "pursuance_id": pursuance.id,
                  "user_username": user.username,
                  "permissions_level": 'Admin', // TODO: Change to 'Trainee' once
                                                // permissions levels are enforced
                })}>
                Join
              </button>
            }
            {
              user.authenticated
              &&
              memberships.membershipMap[user.username + '_' + pursuance.id]
              &&
              <button
                className="leave-btn pursuance-btn"
                onClick={() => deleteMembership({
                  "pursuance_id": pursuance.id,
                  "user_username": user.username
                })}
                >
                Leave
              </button>
            }
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="pursuance-list">
        <h2 className="dash-box-title">Search All Public {PROJECTS_CAPITAL}</h2>
        <div className="public-pursuance-search-form">
          <label>Search by tag:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
          <input
            type="text"
            placeholder="PrisonReform"
            autoFocus
            onChange={this.onChangeTag}
          />
          <br />
          <label>Search {PROJECT} descriptions:</label>
          <input
            type="text"
            placeholder="prison-industrial complex"
          />
        </div>
        <hr />
        <h3>Search Results</h3>
        {this.getPublicPursuanceList()}
      </div>
    )
  }
}

export default connect(({ publicPursuances, user, memberships, publicOrder }) =>
 ({ publicPursuances, user, memberships, publicOrder }),{
   postMembership,
   getMemberships,
   deleteMembership
})(PublicPursuanceList);
