import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './components/SignUp'
import Login from './components/Login'
import { supabase } from './supabase_client'
import Protected from './components/Protected'
import Landing from './components/Landing'

const App = () => {

  return (
    <>
      <Router>
        <div className='fixed w-full z-40'> <Navbar /> </div>
        <Routes>
          <Route path="/" element={ <> <div className='h-full w-full '> <Hero /> </div> </> } />
          <Route path="/signup" element={ <> <div className='h-screen w-screen'> <Signin /> </div> </> } />
          <Route path="/login" element={ <> <div className='h-screen w-screen'> <Login /> </div> </> } />
          <Route path="/landing" element={ <> <Protected> <div className='h-screen w-screen'> <Landing /> </div> </Protected> </>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App