import React, { useState , useRef, useEffect } from 'react'
import CountUp from 'react-countup';

const Stats = () => {
    const myRef = useRef();
    const [isVisible, setIsVisible] = useState(false)
    console.log(isVisible)
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            const entry = entries[0];
            setIsVisible(entry.isIntersecting)
        })
        observer.observe(myRef.current);
    }, [])  
    return (
        <div className={`h-full w-full py-20 transition-all duration-1000`}>
            <div className='flex flex-col items-center pb-15 pt-10 bg-blue-200 mx-80 rounded-2xl shadow-2xl'>
                <div className='text-4xl text-white pb-5 font-extralight'>The Difference We Make</div>
                <div className={`flex w-[80%] justify-evenly gap-5`}>
                    <div className='w-[350px] h-[300px] bg-blue-400 rounded-2xl border-2 border-zinc-100 flex flex-col justify-center pb-10 items-center'>
                        <p ref={myRef} className='white font-extrabold text-9xl text-white'>
                            {isVisible && <CountUp start={0} end={60} duration={5}/>}%</p>
                        <p className='white text-xl text-white text-center leading-tight'>
                            Improves Patient Understanding
                        </p>
                    </div>
                    <div className='w-[350px] h-[300px] bg-blue-400 rounded-2xl border-2 border-zinc-100 flex flex-col justify-center pb-10 items-center'>
                        <p className='white font-extrabold text-9xl text-white'>
                            {isVisible && <CountUp start={0} end={40} duration={5}/>}%</p>
                        <p className='white text-xl text-white text-center leading-tight'>
                            Reduces Doctor Dependence
                        </p>
                    </div>
                    <div className='w-[350px] h-[300px] bg-blue-400 rounded-2xl border-2 border-zinc-100 flex flex-col justify-center pb-10 items-center'>
                        <p className='white font-extrabold text-9xl text-white'>
                            {isVisible && <CountUp start={0} end={30} duration={5}/>}%</p>
                        <p className='white text-xl text-white text-center leading-tight'>
                            Speeds Up Health Decision-Making
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Stats