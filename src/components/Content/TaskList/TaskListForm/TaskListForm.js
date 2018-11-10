import React, { Component } from 'react';
import generateId from '../../../../utils/generateId';
import moment from 'moment';
import { connect } from 'react-redux';
import AssignerSuggestions from '../../TaskManager/TaskForm/Suggestions/AssignerSuggestions';
import AssignerInput from '../../TaskManager/TaskForm/AssignerInput/AssignerInput';
import DueDatePicker from '../../TaskManager/TaskForm/DatePicker/DatePicker';
import { PURSUANCE_DISPLAY_PREFIX } from '../../../../constants';
import {
  updateFormField,
  clearTaskFormFields,
  postTaskList,
} from '../../../../actions';
import './TaskListForm.css';

class TaskListForm extends Component {

  componentWillMount() {
    const { parentTaskListId, updateFormField, id } = this.props;
    // Use `id` from props or create new one
    this.id = id || generateId('taskList');
    updateFormField(this.id, 'parent_task_list_id', parentTaskListId || null);
  }

  getClassName = () => {
    if (this.props.topLevel) {
      return 'task-form-ctn';
    } else {
      return 'task-form-ctn nested-form';
    }
  }

  onChange = (e) => {
    const { updateFormField } = this.props;
    const { value, name } = e.target;

    updateFormField(this.id, name, value);
  }

  handleDateSelect = (date) => {
    if (date) {
      // Currently ignored until date Picker input is updating Redux value
      this.props.updateFormField(this.id, 'due_date_raw', date);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      postTaskList, taskForm, currentPursuanceId, pursuances,
      clearTaskFormFields, isInTaskList
    } = this.props;
    const taskList = taskForm[this.id];
    const assignedTo = taskList.assigned_to;
    if (!taskList.name) {
      console.log("Thou shalt not submit empty TaskListForm!");
      return;
    }
    if (assignedTo && assignedTo.startsWith(PURSUANCE_DISPLAY_PREFIX)) {
      for (var key in pursuances) {
        if (pursuances[key].suggestionName === assignedTo) {
          taskList.assigned_to_pursuance_id = pursuances[key].id;
          delete taskList.assigned_to;
          break;
        }
      }
    }
    taskList.pursuance_id = currentPursuanceId;
    if (taskList.due_date_raw) {
      taskList.due_date = moment(taskList.due_date_raw).format();
    }
    delete taskList.due_date_raw;

    // TODO(elimisteve): Make configurable so users can make task
    // lists that are not roles
    taskList.is_role = true;

    postTaskList(taskList);
    clearTaskFormFields(this.id, isInTaskList);

    this.nameRef.focus();
  }

  focusDatePicker = () => {
    this.dueDatePicker.datePickerRef.input.focus();
  }

  render() {
    const { taskForm, autoComplete, autoFocus } = this.props;
    const { name, assigned_to, due_date_raw } = taskForm[this.id] || {};
    return (
      <div className={this.getClassName()}>
        <form className="task-form" name={this.id} autoComplete="off">
          <div id="input-task-title-ctn" className="">
            <input
              id="input-task-title"
              type="text"
              className="form-control"
              placeholder="Role Name / Position Title"
              name={'name'}
              value={name || ''}
              autoFocus={autoFocus !== false}
              ref={(input) => this.nameRef = input}
              onChange={this.onChange}
              maxLength={200}
            />
          </div>
          <div className="assign-autocomplete-ctn">
            {
              autoComplete.suggestions
              &&
              this.id === autoComplete.suggestionForm
              &&
              <AssignerSuggestions
                focusDatePicker={this.focusDatePicker}
                suggestionForm={this.id}
                editMode={false}
              />
            }
            <AssignerInput
               placeholder={"Assigned To"}
               formId={this.id}
               assigned_to={assigned_to}
               focusDatePicker={this.focusDatePicker}
               editMode={false}
             />
          </div>
          <DueDatePicker
            id={this.id}
            selected={due_date_raw || ''}
            onRef={ref => (this.dueDatePicker = ref)}
           />
          <button className="btn btn-default save-task-btn" onClick={this.handleSubmit}>
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default connect(({ taskForm, currentPursuanceId, pursuances, tasks, autoComplete }) =>
  ({ taskForm, currentPursuanceId, pursuances, tasks, autoComplete }), {
   updateFormField,
   clearTaskFormFields,
   postTaskList,
})(TaskListForm);
