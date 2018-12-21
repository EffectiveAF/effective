import React, { Component } from 'react';
import CreatePursuanceForm from './CreatePursuanceForm/CreatePursuanceForm';
import SettingsInfoModal from './SettingsInfoModal/SettingsInfoModal';
import { PROJECT_CAPITAL } from '../../constants';
import './CreatePursuance.css';

class CreatePursuance extends Component {
  render(){
    return (
      <div className="create-pursuance-container">
        <div className="create-pursuance-header">
          <h2>Create a {PROJECT_CAPITAL}</h2>
        </div>
        <SettingsInfoModal />
        <CreatePursuanceForm />
      </div>
    )
  }
}

export default CreatePursuance;
