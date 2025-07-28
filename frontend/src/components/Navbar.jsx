import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()

  const routeTextColors = {
    '/': 'text-white',
    '/login': 'text-black',
    '/signup': 'text-black',
  }

  const text_color = routeTextColors[location.pathname] || 'text-white'

  return (
        <div className='flex justify-between items-center py-4 px-10 
     bg-white/10 backdrop-blur-lg border-b border-white/20 
     fixed top-0 w-full z-50'>
            <h1 className={`text-3xl ${text_color} cursor-pointer`}>
              <Link to='/'>ClearReport</Link></h1>
            <div className='flex justify-evenly gap-20 text-xl items-center'>
                <p className={`${text_color}`}>About Us</p>
                <Link to="/login" className='text-white px-3 bg-blue-500 py-2
                rounded-2xl cursor-pointer hover:bg-blue-600' onClick={() => {

                }}>Login</Link>
            </div>
        </div>
  )
}

export default Navbar