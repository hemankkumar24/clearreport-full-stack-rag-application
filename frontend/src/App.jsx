import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import About from './components/About'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './components/Signin'
import Login from './components/Login'

const App = () => {
  return (
    <>
      <Router>
        <div className='fixed w-full z-50'>
          <Navbar />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className='h-full w-full'>
                  <Hero />
                </div>
                <div className='h-full w-full bg-zinc-100'>
                  <Stats />
                </div>
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <div className='h-screen w-screen'>
                  <Signin />
                </div>
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <div className='h-screen w-screen'>
                  <Login />
                </div>
              </>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App