const initialState = {
  taskListMap: {},
  rootTaskListIds: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case 'GET_TASK_LISTS_PENDING':
      return state;

    case 'GET_TASK_LISTS_FULFILLED':
      const { taskListMap, rootTaskListIds } = action.payload;
      return Object.assign({}, state, {
        taskListMap: Object.assign({}, state.taskListMap, taskListMap),
        rootTaskListIds,
      });

    case 'GET_TASK_LISTS_REJECTED':
      return state;

    case 'POST_TASK_LIST_PENDING':
      return state;

    case 'POST_TASK_LIST_FULFILLED': {
      const taskList = action.payload;
      const taskListMapDiff = {
        [taskList.id]: {
          ...taskList,
          subtasklist_ids: [],
        },
      }

      const parentTaskListId = taskList.parent_task_list_id;

      const updatedRootTaskListIds = { ...state.rootTaskListIds };
      if (!parentTaskListId) {
        updatedRootTaskListIds.push(taskList.id);
      } else {
        // Add to parent's children
        const parentTaskList = state.taskListMap[parentTaskListId];
        taskListMapDiff[parentTaskListId] = {
          ...parentTaskList,
          subtasklist_ids: [...(parentTaskList.subtasklist_ids || []), taskList.id],
        };
      }

      return Object.assign({}, state, {
        taskListMap: Object.assign({}, state.taskListMap, taskListMapDiff),
        rootTaskListIds: updatedRootTaskListIds,
      });
    }

    case 'POST_TASK_TO_TASK_LIST_FULFILLED': {
      const { updatedTaskList } = action.payload;
      return Object.assign({}, state, {
        taskListMap: Object.assign({}, state.taskListMap, {
          [updatedTaskList.id]: {
            ...state.taskListMap[updatedTaskList.id],
            ...updatedTaskList,
          }
        })
      });
    }

    case 'POST_TASK_LIST_REJECTED':
      return state;

    case 'DELETE_TASK_LIST_FULFILLED': {
      const deletedTaskList = action.payload;

      // Create new taskListMap that excludes the task just deleted
      const newTaskMap = Object.assign({}, state.taskListMap);
      delete newTaskMap[deletedTaskList.id];

      const parentTaskListId = deletedTaskList.parent_task_list_id;
      if (!parentTaskListId) {
        return Object.assign({}, state, {
          taskListMap: newTaskMap
        });
      }
      const parent = state.taskListMap[parentTaskListId];
      // Update parentTaskList.subtasklist_ids in redux so that it excludes
      // deletedTaskList.id
      const newParentSubtasklistIds = parent.subtasklist_ids.filter(
        id => id !== deletedTaskList.id
      );
      return Object.assign({}, state, {
        taskListMap: Object.assign(newTaskMap, {
          [parentTaskListId]: {
            ...parent,
            subtasklist_ids: newParentSubtasklistIds
          }
        })
      });
    }

    case 'ADD_POSTED_ROOT_TASK_LIST':
      const { taskList } = action;
      return Object.assign({}, state, {
        rootTaskListIds: [...state.rootTaskListIds, taskList.id],
        taskListMap: Object.assign({}, state.taskListMap, {
          [taskList.id]: taskList
        })
      });

    case 'ADD_POSTED_SUB_TASK_LIST': {
      const subTaskList = action.task;
      const parentTaskListId = subTaskList.parent_task_list_id;
      const parentTaskList = state.taskListMap[parentTaskListId];
      return Object.assign({}, state, {
        taskListMap: Object.assign({}, state.taskListMap, {
          [subTaskList.id]: subTaskList,
          [parentTaskListId]: Object.assign({}, parentTaskList, {
            subtasklist_ids: [...parentTaskList.subtasklist_ids, subTaskList.id]
          })
        })
      });
    }

    case 'PATCH_TASK_LIST_PENDING':
      return state;

    case 'TASK_LIST_SET_ASSIGNEE_FULFILLED':
    // Fallthrough
    case 'PATCH_TASK_LIST_FULFILLED':
      const t = action.payload;
      const patchedTaskList = {
        ...state.taskListMap[t.id] || {}, // Re-add local: .subtasklist_ids,
                                          // .subtasklistform_id, etc
        ...t
      };
      return Object.assign({}, state, {
        taskListMap: Object.assign({}, state.taskListMap, {
          [patchedTaskList.id]: patchedTaskList
        })
      });

    case 'TASK_LIST_ARCHIVE_FULFILLED': {
      const archivedTaskList = action.payload;

      // Create new taskListMap that excludes the taskList just archived
      const newTaskListMap = Object.assign({}, state.taskListMap);
      delete newTaskListMap[archivedTaskList.id];

      const parentTaskListId = archivedTaskList.parent_task_list_id;
      if (!parentTaskListId) {
        return Object.assign({}, state, {
          taskListMap: newTaskListMap
        });
      }
      const parentTaskList = state.taskListMap[parentTaskListId];
      // Update parentTaskList.subtasklist_ids in redux so that it excludes
      // archivedTaskList.id
      const newParentSubtasklistIds = parentTaskList.subtasklist_ids.filter(
        id => id !== archivedTaskList.id
      );
      return Object.assign({}, state, {
        taskListMap: Object.assign(newTaskListMap, {
          [parentTaskListId]: {
            ...parentTaskList,
            subtasklist_ids: newParentSubtasklistIds
          }
        })
      });
    }

    case 'TASK_LIST_FORM_SET_PARENT_ID': {
      const { formId, newParentId, oldParentId } = action;
      const newParent = state.taskListMap[newParentId];
      const oldParent = state.taskListMap[oldParentId];
      return Object.assign({}, state, {
        taskListMap: Object.assign({}, state.taskListMap, {
          [newParentId]: Object.assign({}, newParent, {
            subtaskform_id: formId
          }),
          [oldParentId]: Object.assign({}, oldParent, {
            subtaskform_id: null
          })
        })
      });
    }

    case 'TASK_LIST_FORM_ADD_UNDER_PARENT': {
      const { parentTaskListId, taskListFormId } = action;
      const parentTaskList = state.taskListMap[parentTaskListId];
      return Object.assign({}, state, {
        taskListMap: Object.assign({}, state.taskListMap, {
          [parentTaskListId]: Object.assign({}, parentTaskList, {
            subtasklistform_id: taskListFormId
          })
        })
      });
    }

    case 'TASK_LIST_FORM_REMOVE_FROM_UNDER_PARENT': {
      const { parentTaskListId } = action;
      const parentTaskList = state.taskListMap[parentTaskListId];
      return Object.assign({}, state, {
        taskListMap: Object.assign({}, state.taskListMap, {
          [parentTaskListId]: Object.assign({}, parentTaskList, {
            subtasklistform_id: null
          })
        })
      });
    }

    case 'TASK_LIST_ADD_TASK_FORM_END': {
      const { parentTaskListId, taskFormId } = action;
      const parentTaskList = state.taskListMap[parentTaskListId];
      return Object.assign({}, state, {
        taskListMap: Object.assign({}, state.taskListMap, {
          [parentTaskListId]: Object.assign({}, parentTaskList, {
            subtaskform_id: taskFormId
          })
        })
      });
    }

    case 'TASK_LIST_REMOVE_TASK_FORM_END': {
      const { parentTaskListId } = action;
      const parentTaskList = state.taskListMap[parentTaskListId];
      return Object.assign({}, state, {
        taskListMap: Object.assign({}, state.taskListMap, {
          [parentTaskListId]: Object.assign({}, parentTaskList, {
            subtaskform_id: null
          })
        })
      });
    }

    default:
      return state;
  }
}
