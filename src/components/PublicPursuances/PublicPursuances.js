import React, { Component } from 'react';
import PublicPursuanceList from './PublicPursuanceList';
import { getPublicPursuances, setPublicOrder } from '../../actions';
import { connect } from 'react-redux';
import { PROJECTS_CAPITAL } from '../../constants';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import './PublicPursuances.css';

class PublicPursuances extends Component {

  componentWillMount() {
    this.props.getPublicPursuances();
  }

  handleChange = (value) => {
    this.props.setPublicOrder(value);
  }

  render () {
    return (
      <div id="dashboard">
        <div id="dashboard-title">
          <h1>Public {PROJECTS_CAPITAL}</h1>
        </div>
        <div id="dash-first-row">
          <div className="dash-ctn">
            <div className="dash-box">
              <div className="sort noselect">
                <label>Sort:</label>
                <DropdownButton
                  id="sort-dropdown"
                  title={ this.props.publicOrder }
                  onSelect={ this.handleChange } 
                  >
                  <MenuItem
                    key='Most Recent'
                    eventKey='Most Recent'
                    value='Most Recent'
                    >
                    Most Recent
                  </MenuItem>
                  <MenuItem
                    key='Oldest'
                    eventKey='Oldest'
                    value='Oldest'
                    >
                    Oldest
                  </MenuItem>
                  <MenuItem
                    key='A to Z'
                    eventKey='A to Z'
                    value='A to Z'
                    >
                    A to Z
                  </MenuItem>
                  <MenuItem
                    key='Z to A'
                    eventKey='Z to A'
                    value='Z to A'
                    >
                    Z to A
                  </MenuItem>
                </DropdownButton>
              </div>
              <PublicPursuanceList />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({publicOrder}) => ({publicOrder}), { 
    setPublicOrder, 
    getPublicPursuances 
  }
)(PublicPursuances);
