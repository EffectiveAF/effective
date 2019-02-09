import React, {Component} from 'react';
import {connect} from 'react-redux';
import ReactMarkdown from 'react-markdown';
import './Wysiwyg.css';

class Wysiwyg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editorState: '',
    };
  }

  editModeEnable = () => {
    const {tasks: { taskMap }, taskGid, attributeName} = this.props;

    this.setState({
      editMode: true,
      editorState: taskMap[taskGid][attributeName], 
    });
  };

  editModeDisable = () => {
    this.setState({
      editMode: false
    });
  }

  handleSpecialKeypress = e => {
    if (e.keyCode === 13 /* `enter` key */ && (e.altKey || e.ctrlKey)) { 
      this.save();
    } else if (e.keyCode === 27 /* `escape` key */) {
      this.editModeDisable();
    }
  }

  onChange = event => {
    this.setState({
      editorState: event.target.value
    });
  };
  
  save = () => {
    const {patchTask} = this.props,
      markdown = this.state.editorState,
      payload = {gid: this.props.taskGid};

    payload[this.props.attributeName] = markdown;

    patchTask(payload);

    this.setState({
      editMode: false
    });
  }

  render() {
    const {tasks: { taskMap }, taskGid, attributeName} = this.props;
    const attributeValue = taskMap[taskGid][attributeName];

    return (
      <div>
        <h4>
          <strong>Description / Deliverables</strong>&nbsp;&nbsp;
          {this.state.editMode && <button className='wysiwyg-save' onClick={this.save}>Save</button>}
          {!this.state.editMode && <button className='wysiwyg-edit' onClick={this.editModeEnable}>Edit</button>}
        </h4>
        {
          this.state.editMode && (
            <textarea
                className="wysiwyg"
                onChange={this.onChange}
                onKeyDown={this.handleSpecialKeypress}
                name="message"
                value={this.state.editorState}>
            </textarea>
          )
        }
        {
          !this.state.editMode && <ReactMarkdown source={attributeValue} />
        }
      </div>
    );
  }
}

export default connect(({tasks}) => ({tasks}), null)(Wysiwyg);
