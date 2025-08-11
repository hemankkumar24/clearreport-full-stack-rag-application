import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='h-[100vh] w-full bg-amber-50 overflow-hidden' id="regularR">
      <div className="absolute inset-0 bg-[url('/images/grid.png')] opacity-10 pointer-events-none"></div>
      <div className='pt-20 flex justify-center items-center w-full'>
        <div className='text-5xl sm:text-6xl 2xl:text-7xl font-semibold text-center mt-25 tracking-tight leading-10 sm:leading-12 2xl:leading-16 z-20'>Redefining <i id="heroText" className='font-extralight'>health insights</i> <br/> through  <i id="heroText" className='font-extralight'>AI and automation</i>
        <p className='mt-3 text-center text-lg leading-6 text-gray-600 max-w-3xl mx-auto tracking-normal'>
          Our platform transforms complex medical reports into clear, human-friendly explanations. 
          From lab test interpretations to trend visualizations and AI-powered health Q&A, 
          we make personalized healthcare understandable, accessible, and actionable for everyone.
        </p>
        <Link to='/signup'><div className='text-sm sm:text-xl tracking-normal mt-3 bg-black text-white w-[50%] lg:w-[30%] text-center mx-auto p-2 px-3 rounded-2xl hover:text-black hover:bg-white hover:shadow-xl cursor-pointer gap-5'>Get Started for Free <i class="ri-arrow-right-line"></i></div></Link>
        </div>
      </div>
      <img src="/images/rbc.png" alt="" className='-rotate-45 -scale-95 relative hidden 2xl:block md:bottom-30 lg:bottom-70 2xl:bottom-105 z-10 select-none' draggable={false} onDragStart={(e) => e.preventDefault()}/>
      <img src="/images/rbc.png" alt="" className='-rotate-45 scale-105 relative hidden 2xl:block 2xl:bottom-550 blur-xs opacity-10 grayscale select-none' draggable={false} onDragStart={(e) => e.preventDefault()}/>
    </div>
  )
}

export default Hero