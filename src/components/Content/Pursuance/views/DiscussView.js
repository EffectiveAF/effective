import React, { Component } from 'react';
import { connect } from 'react-redux';
import { rpShowTaskDetails } from '../../../../actions';
import './DiscussView.css';

// Set leapChatUrl constant for use below
const REACT_APP_DOMAIN_BASE_URL = process.env.REACT_APP_DOMAIN_BASE_URL;
const DEFAULT_DOMAIN_BASE_URL = 'http://localhost:8080/';
const REACT_APP_LEAPCHAT_PASSPHRASE = process.env.REACT_APP_LEAPCHAT_PASSPHRASE;
const DEFAULT_LEAPCHAT_PASSPHRASE = 'GiddinessPuttRegisterKioskLucidityJockstrapTastebudFactoryPegboardOpticalEstrogenGoatskinHatchlingDittoPseudoNegotiatorLunchboxLightbulbUploadSyllableTulipQuiltJurorRuptureAorta';
const DOMAIN_BASE_URL = REACT_APP_DOMAIN_BASE_URL || DEFAULT_DOMAIN_BASE_URL;
const LEAPCHAT_PASSPHRASE = REACT_APP_LEAPCHAT_PASSPHRASE || DEFAULT_LEAPCHAT_PASSPHRASE;
const leapChatUrl = `${DOMAIN_BASE_URL}#${LEAPCHAT_PASSPHRASE}`;

class DiscussView extends Component {

  componentWillMount() {
    const {
      match: { params: { taskGid } },
      rpShowTaskDetails
    } = this.props;

    rpShowTaskDetails({taskGid});
  }

  getIframeStyle = () => {
    const { rightPanel } = this.props;
    if (rightPanel.show) {
      return "leapchat-frame leapchat-frame-narrow";
    } else {
      return "leapchat-frame";
    }
  }

  render() {
    const { match: { params: { taskGid } } } = this.props;
    return (
      <div className="discuss-ctn">
        <iframe key={taskGid} className={this.getIframeStyle()} title="LeapChat" src={leapChatUrl + taskGid} />
      </div>
    );
  };
}

export default connect(({tasks, rightPanel}) => ({tasks, rightPanel}), { rpShowTaskDetails })(DiscussView);
