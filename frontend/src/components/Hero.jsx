import React from 'react'

const Hero = () => {
  return (
    <div className='py-25 h-screen w-full 
    bg-[url("/images/hero_bg.jpg")] bg-cover bg-bottom 
    px-70 filter'>
        <div className='flex justify-between items-center h-full w-full'>
            <div className='border-b-4 border-r-4 border-white rounded-full p-10 h-[600px] w-[600px]'>
            <img src="/images/hero_image.png" alt="" 
            className='h-[500px] w-[600px] object-cover
            rounded-2xl border-b-4 border-r-4 border-white'/>
            </div>
            <div className='w-[48.2%] flex flex-col gap-y-3 justify-center'>
                <div className='text-[#f0f2fa] text-6xl  text-right '>Understand Your Medical Reports with AI</div>
                <div className='text-2xl text-left text-[#f0f2fa] font-light'>
                    Our intelligent tool extracts key results from your lab reports and explains them in plain English (or Hindi) with charts, trends, and no jargon.
                </div>
            </div>
        </div>         
    </div>
  )
}

export default Hero