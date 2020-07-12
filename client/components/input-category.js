import React, { useState} from 'react'
import { Link } from 'react-router-dom'
import Head from './head'
import { getTasksList } from '../redux/reducers/tasks'

// import { history } from '../redux'

const InputCategory = () => {
  const [category, setCategory] = useState('')

  return (
    <div>
      <Head title="Hello" />
      <div className=" flex justify-center mt-10">
        <div className="bg-gray-300 text-center shadow-md rounded px-8 py-8">
          <input
            className="mb-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <Link
          to={`/${category}`}
            className="bg-purple-400  hover:bg-purple-600 text-white font-bold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => {
              getTasksList(category)
            }}
          >
            submit
          </Link>
        </div>
      </div>
    </div>
  )
}

InputCategory.propTypes = {}

export default React.memo(InputCategory)
