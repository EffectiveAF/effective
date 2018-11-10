const TASK_LIST_FORM_FIELDS_TO_NOT_CLEAR = ['parent_task_list_id',
                                            'pursuance_id',
                                            'is_role'];

export default function(state = {}, action) {
  switch (action.type) {
    case 'TASK_FIELD_UPDATE':
      const { formId, fieldId, value } = action;
      return Object.assign({}, state, {
        [formId]: Object.assign({}, state[formId], {
          [fieldId]: value
        })
      });

    case 'TASK_FORM_CLEAR_FIELDS': {
      // ...except parent_task_gid and parent_task_list_id
      const { formId, isInTaskList } = action;
      const newForm = {};
      let fieldName = '';
      if (isInTaskList) {
        for (let i in TASK_LIST_FORM_FIELDS_TO_NOT_CLEAR) {
          fieldName = TASK_LIST_FORM_FIELDS_TO_NOT_CLEAR[i];
          newForm[fieldName] = state[formId][fieldName];
        }
      } else {
        newForm.parent_task_gid = state[formId]['parent_task_gid'];
      }
      return Object.assign({}, state, {
        [formId]: newForm,
      });
    }

    case 'TASK_FORM_SET_PARENT_GID': {
      const { formId, newParentGid } = action;
      return Object.assign({}, state, {
        [formId]: Object.assign(state[formId] || {}, {
          parent_task_gid: newParentGid
        })
      });
    }

    case 'ADD_SUGGESTION':
      const suggestionForm = action.suggestionForm;
      return Object.assign({}, state, {
        [suggestionForm]: Object.assign({}, state[suggestionForm], {
          assigned_to: action.suggestion
        })
      });

    // Also handled in ./tasksReducer.js
    case 'TASK_FORM_ADD_TO_HIERARCHY': {
      const { parentTaskGid, taskFormId } = action;
      return Object.assign({}, state, {
        [taskFormId]: Object.assign({}, state[taskFormId] || {}, {
          parent_task_gid: parentTaskGid
        })
      });
    }

    // Also handled in ./tasksReducer.js
    case 'TASK_FORM_REMOVE_FROM_HIERARCHY': {
      const { taskFormId } = action;
      return Object.assign({}, state, {
        [taskFormId]: {}
      });
    }

    default:
      return state;
  }
}
