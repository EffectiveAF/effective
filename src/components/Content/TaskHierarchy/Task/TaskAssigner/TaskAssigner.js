import React, { Component } from 'react';
import { connect } from 'react-redux';
import AssignerButton from './AssignerButton/AssignerButton';
import AssignerSuggestions from '../../../TaskManager/TaskForm/Suggestions/AssignerSuggestions';
import AssignerInput from '../../../TaskManager/TaskForm/AssignerInput/AssignerInput';
import './TaskAssigner.css';

class TaskAssigner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAssigneeInput: false
    }
  }

  showAssigneeInput = () => {
    this.setState({
      showAssigneeInput: true
    });
  }

  hideEditAssignee = () => {
    this.setState({
      showAssigneeInput: false
    });
  }

  showSuggestions = () => {
    const { autoComplete, taskGid, taskListGid } = this.props;
    return autoComplete.suggestions && (
      taskGid === autoComplete.suggestionForm ||
        taskListGid === autoComplete.suggestionForm
    );
  }

  render() {
    const { showAssigneeInput } = this.state;
    const { taskGid, taskListGid, taskListId, placeholder, assignedTo } = this.props;
    return (
      <div className="task-assigned-to hide-small">
          {
            (showAssigneeInput &&
             <div className="assign-autocomplete-ctn">
               {
                this.showSuggestions()
                 &&
                 <AssignerSuggestions
                   isInTaskList={!!taskListGid}
                   taskListId={taskListId}
                   suggestionForm={taskGid || taskListGid}
                   editMode={true}
                   hideEditAssignee={this.hideEditAssignee}
                 />
               }
              <AssignerInput
                isInTaskList={!!taskListGid}
                taskListId={taskListId}
                formId={taskGid || taskListGid}
                editMode={true}
                hideEditAssignee={this.hideEditAssignee}
                placeholder={placeholder}
                assignedTo={assignedTo}
              />
            </div>)
            ||
              <AssignerButton
                showAssigneeInput={this.showAssigneeInput}
                placeholder={placeholder}
              />
          }
      </div>
    )
  }
}

export default connect(({ autoComplete }) => ({ autoComplete }) )(TaskAssigner);
