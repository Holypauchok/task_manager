import axios from 'axios'

const GET_TASKS_LIST = 'GET_TASKS_LIST'
const NEW_TASK = 'NEW_TASK'
const DEL_TASK = 'DEL_TASK'

const initialState = {
  tasksList: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_TASKS_LIST: {
      return { ...state, tasksList: action.tasks }
    }
    case NEW_TASK: {
      const d = new Date(action.newTask['_createdAt'])
      /* eslint no-param-reassign: "error" */
      action.newTask['_createdAt'] = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
      return {
        ...state,
        tasksList: [...state.tasksList, action.newTask]
      }
    }
    case DEL_TASK: {
      return {
        ...state,
        tasksList: state.tasksList.filter((it) => it.taskId !== action.id)
      }
    }
    default:
      return state
  }
}

export function getTasksList(category, timespan) {
  return function (dispatch) {
    if (typeof timespan !== 'undefined') {
      axios.get(`/api/v1/tasks/${category}/${timespan}`).then(({ data: tasks }) => {
        dispatch({ type: GET_TASKS_LIST, tasks })
      })
    }
    if (typeof category !== 'undefined' && typeof timespan === 'undefined') {
      axios.get(`/api/v1/tasks/${category}`).then(({ data: tasks }) => {
        dispatch({ type: GET_TASKS_LIST, tasks })
      })
    }
  }
}

export function addNewTask(category, title) {
  return function (dispatch) {
    if (typeof title !== 'undefined') {
      axios
        .post(`/api/v1/tasks/${category}`, {
          title
        })
        .then(({ data: newTask }) => {
          dispatch({ type: NEW_TASK, newTask })
        })
    }
  }
}

export function deleteTask(category, id) {
  return function (dispatch) {
    axios.delete(`/api/v1/tasks/${category}/${id}`)
    return dispatch({ type: DEL_TASK, id })
  }
}
