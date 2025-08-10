import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { supabase } from '../supabase_client';

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate();
  const isLanding = location.pathname === '/landing'

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
      console.error('Logout error:', error.message);
    } else {
      navigate('/login'); 
    }
  };

  return (
    <>
      <div className="fixed w-full top-0 py-7 px-5 lg:px-24 flex justify-between items-center backdrop-blur-xs bg-white/10 border-b border-black/10 z-50"
        id="quorva" >
        <div className="flex items-center">
          <i className="ri-heart-pulse-line text-black text-2xl "></i>
          <h1 className={`text-2xl text-black curs  or-pointer relative `}
          ><Link to='/'>ClearReport</Link></h1>
        </div>
        <div className='text-2xl gap-10 flex'>
          <div className='text-zinc-500 cursor-pointer hidden lg:block'><span className='underline text-black'>En</span> Hi</div>

          {isLanding ? (<div className="cursor-pointer" onClick={handleLogout}>Logout</div>) : (<div className="cursor-pointer"><Link to='/login'>Login</Link></div>) }
        </div>
      </div>
    </>
  )
}

export default Navbar