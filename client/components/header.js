import React from 'react'
import { useParams } from 'react-router-dom'

const Header = () => {
  const { category } = useParams()
  return (
    <header className="flex items-center justify-around flex-wrap bg-purple-400 p-6 text-white">
      <div className="flex items-center flex-shrink-0 mr-6">
        <svg
          className="fill-current h-8 w-8 mr-2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M7 18H17V16H7V18Z" fill="currentColor" />
          <path d="M17 14H7V12H17V14Z" fill="currentColor" />
          <path d="M7 10H11V8H7V10Z" fill="currentColor" />
          <path d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z" />
        </svg>
        <span className="font-semibold text-xl tracking-tight uppercase">task manager</span>
      </div>
      <div>
        <span className="font-semibold text-xl tracking-tight uppercase">{category}</span>
      </div>
    </header>
  )
}

export default React.memo(Header)
