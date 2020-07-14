import React from 'react'
import { useParams } from 'react-router-dom'
import { history } from '../redux'

const Filter = () => {
  const { category } = useParams()
  function clickedDate(e) {
    history.push(`/${category}/${e === 'all' ? '' : e}`)
  }
  return (
    <div className="flex">
      {['all', 'day', 'week', 'month'].map((it) => {
        return (
          <button
            className="px-4 text-purple-700 font-semibold focus:outline-none hover:text-purple-900 hover:shadow-lg"
            key={it}
            type="button"
            onClick={(e) => clickedDate(e.currentTarget.innerText)}
          >
            {it}
          </button>
        )
      })}
    </div>
  )
}

export default Filter
