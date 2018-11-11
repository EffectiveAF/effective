import * as postgrest from './postgrest';

export const postTaskListReq = taskList => {
  return postgrest
    .postJSON('/task_lists', taskList, { Prefer: 'return=representation' })
    .then(taskListJSON => taskListJSON[0])
    .catch(err => console.log('Error posting task list:', err));
};

export const patchTaskListReq = taskList => {
  return postgrest
    .patchJSON(`/task_lists?id=eq.${taskList.id}`, taskList, {
      Prefer: 'return=representation'
    })
    .then(taskListJSON => taskListJSON[0])
    .catch(err => console.log('Error patching task list:', err));
};

export const deleteTaskListReq = taskList => {
  return postgrest
    .deleteJSON(`/task_lists?id=eq.${taskList.id}`, {
      Prefer: 'return=representation'
    })
    .then(taskListJSON => taskListJSON[0])
    .catch(err => console.log('Error deleting task list:', err));
};

export const getTaskListsReq = (pursuanceId, filterOptions = {}, { includeArchived = false } = {}) => {
  const filterOptionsStr = Object.keys(filterOptions).map(key => {
    return key + '=eq.' + filterOptions[key];
  }).join('&')
  return postgrest
    .getJSON(
      `/task_lists?or=(pursuance_id.eq.${pursuanceId},assigned_to_pursuance_id.eq.${
        pursuanceId
      })&order=created.asc,id.asc` +
        (includeArchived ? '' : '&is_archived=is.false') +
        (filterOptionsStr ? '&'+filterOptionsStr : '')
    )
    .then(taskLists => {
      const { taskListMap, rootTaskListIds } = buildTaskListHierarchy(taskLists, pursuanceId);
      return { taskListMap, rootTaskListIds };
    })
    .catch(err => {
      console.log('Error fetching task lists:', err);
    });
};

const buildTaskListHierarchy = (taskLists, currentPursuanceId) => {
  const taskListMap = {};
  const rootTaskListIds = [];
  for (let i = 0; i < taskLists.length; i++) {
    const t = taskLists[i];
    taskListMap[t.id] = Object.assign(t, { subtasklist_ids: [] });

    if (!t.parent_task_list_id || t.assigned_to_pursuance_id === currentPursuanceId) {
      rootTaskListIds.push(t.id);
    } else {
      // Add t to its parent's subtasklists (if its parent is in taskListMap)
      if (taskListMap[t.parent_task_list_id]) {
        taskListMap[t.parent_task_list_id].subtasklist_ids.push(t.id);
      } else {
        console.log(
          `Task list ${t.id} ("${t.title}")'s parent ${t.parent_task_list_id}` +
            ` not found in taskListMap`
        );
      }
    }
  }

  return {
    taskListMap,
    rootTaskListIds,
  };
};
