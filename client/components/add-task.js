import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import { useParams } from 'react-router-dom'
// import axios from 'axios'
import Filter from './filter-date'
import { addNewTask } from '../redux/reducers/tasks'

const AddTask = () => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const { category } = useParams()
  //  const setNewTask = () => {
  //    if (typeof title !== 'undefined') {
  //      axios
  //        .post(`http://localhost:8087/api/v1/tasks/${category}`, {
  //          title
  //        })
  //        .then((res) => {
  //          return res
  //        })
  //    }
  //  }
  return (
    <div className="content__form">
      <Filter />
      <div className="max-w-sm">
        <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            className="flex-shrink-0 bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 text-sm border-4 text-white  px-4 rounded"
            type="button"
            onClick={() => {
              dispatch(addNewTask(category, title))
              setTitle('')
            }}
          >
            add
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTask
