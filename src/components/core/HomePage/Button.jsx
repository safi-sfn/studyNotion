import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({children,active,linkto}) => {
  return (
    <Link to={linkto}>
        <div className={`text-center text-[13px] px-6 py-3 rounded-md font-bold`}>
            {children}
        </div>
    </Link>
  )
}

export default Button