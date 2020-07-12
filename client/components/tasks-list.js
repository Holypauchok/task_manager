import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import AddTask from './add-task'
import Header from './header'

import { getTasksList, deleteTask } from '../redux/reducers/tasks'

const TasksList = () => {
  const { category, timespan } = useParams()

  const tasksList = useSelector((store) => store.tasks.tasksList)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTasksList(category, timespan))
  }, [])
  return (
    <div>
      <Header />
      <div className="container">
        <div className="content">
          <AddTask />
          <div className="content__list">
            {tasksList.map((task) => {
              return (
                <div key={task.taskId}>
                  <div className="content__task">
                    <div className="content__item">{task.title}</div>
                    <div className="content__item">{task.status}</div>
                    <div className="content__item">{task['_createdAt']}</div>
                    <div className="content__item">
                      <input
                        type="button"
                        className="content__button-delete"
                        onClick={() => dispatch(deleteTask(category, task.taskId))}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

TasksList.propTypes = {}

export default TasksList
