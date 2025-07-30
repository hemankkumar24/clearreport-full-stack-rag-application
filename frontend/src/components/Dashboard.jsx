import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase_client';
import useSession from '../hooks/useSession';

const Dashboard = () => {
    const { session, isLoading } = useSession();
    const [popup, setPopup] = useState(false)
    const userId = session?.user?.id;

    useEffect(() => {
        const verify_get_data = async () => {
            if (!isLoading && session) {
                const { data, error } = await supabase.from('profiles').select('full_name').eq('id', userId).single()
                // console.log(data.full_name)
                if (data.full_name == null) {
                    setPopup(true);
                }
            }
        };
        verify_get_data();
    }, [session, isLoading])

    const [fullName, setFullName] = useState(null)
    const [age, setAge] = useState(null)
    const [gender, setGender] = useState(null)

    const fullNameHandler = (e) => {
        e.preventDefault();
        setFullName(e.target.value);
    }

    const ageHandler = (e) => {
        e.preventDefault();
        setAge(e.target.value);
    }

    const genderHandler = (e) => {
        e.preventDefault();
        setGender(e.target.value);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const {data, error } = await supabase.from('profiles').update({'full_name': fullName, 'age': age, 'gender': gender}).eq('id', userId).single()

         if (error) {
            console.error("Insert error:", error.message);
        } else {
            console.log("Insert success:", data);
            setPopup(false);
        }
    }

    return (
        <>
            {popup && <div className='absolute w-full h-screen flex justify-center items-center bg-black/80 z-50'>
                <div className='w-[500px] h-[500px] bg-zinc-100 p-7 pt-5 rounded '>
                    <div className="text-2xl">Welcome! Let's Complete Your Profile</div>
                    <div className=" text-gray-600">Just a few more details to get you started.</div>
                    <form onSubmit={(e) => {
                        submitHandler(e);
                    }}>
                        <div>
                            <div className='text-xl pt-8 text-gray-700'>Full Name</div>
                            <input type="text" className='w-full border-zinc-500 px-3 py-3 rounded border-1 focus:ring-0 outline-0 focus:border-blue-400' value={fullName} 
                            onChange={(e) => {
                                fullNameHandler(e);
                            }}/>
                        </div>
                        <div>
                            <div className='text-xl pt-5 text-gray-700'>Age</div>
                            <input type="text" className='w-full border-zinc-500 px-3 py-3 rounded border-1 focus:ring-0 outline-0 focus:border-blue-400' value={age} 
                            onChange={(e) => {
                                ageHandler(e);
                            }}/>
                        </div>
                        <div>
                            <label htmlFor="gender" className="block text-xl font-medium text-gray-700 mb-1 pt-5 ">
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm  focus:ring-blue-500 sm:text-sm h-15 border-1 focus:ring-0 outline-0 focus:border-blue-400" value={gender} 
                                onChange={(e) => {
                                    genderHandler(e);
                                }}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button className='bg-emerald-500 w-full mt-5 rounded h-15 text-white text-xl'>Submit</button>
                    </form>
                </div>
            </div>}
            <div>Dashboard</div>
        </>
    )

}

export default Dashboard