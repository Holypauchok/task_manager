import React from 'react'
import { useParams } from 'react-router-dom'
import { history } from '../redux'

const Filter = () => {
  const { category } = useParams()
  function clickedDate(e) {
    history.push(`/${category}/${e.currentTarget.innerText}`)
  }
  return (
    <div className="content__filter">
      <div>
        <button type="button" onClick={() => history.push(`/${category}`)}>
          all
        </button>
      </div>
      <div>
        <button type="button" onClick={(e) => clickedDate(e)}>
          day
        </button>
      </div>
      <div>
        <button type="button" onClick={(e) => clickedDate(e)}>
          week
        </button>
      </div>
      <div>
        <button type="button" onClick={(e) => clickedDate(e)}>
          month
        </button>
      </div>
    </div>
  )
}

export default Filter
