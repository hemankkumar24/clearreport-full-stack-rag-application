import React, { useEffect, useState } from 'react'
import { supabase } from '../supabase_client';
import useSession from '../hooks/useSession';
import PdfDropzone from './PDFDrop';
import { Link, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Upload from './Upload';
import Trends from './Trends';
import AskAI from './AskAI';
import Reports from './Reports';


const Landing = () => {
    const navigate = useNavigate();
    const { session, isLoading } = useSession();
    const [popup, setPopup] = useState(false)
    const userId = session?.user?.id;

    useEffect(() => {
        const verify_get_data = async () => {
            if (!isLoading && session) {
                const { data, error } = await supabase.from('profiles').select('full_name').eq('id', userId).single()

                if (data.full_name == null) {
                    setPopup(true);
                }

                if (error) {
                    console.log("AAAAAAAAAAAAAAAAAA", error.message)
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
        const { data, error } = await supabase.from('profiles').update({ 'full_name': fullName, 'age': age, 'gender': gender }).eq('id', userId).single()

        if (error) {
            console.error("Insert error:", error.message);
        } else {
            console.log("Insert success:", data);
            setPopup(false);
        }
    }

    const [profileData, setProfileData] = useState(null)

    useEffect(() => {
        if (userId) {
            const getProfile = async () => {
                const { data, error } = await supabase.from('profiles').select('*').eq("id", userId).single()
                if (error) {
                    console.error("Insert error:", error.message);
                }
                else {
                    setProfileData(data);
                }
            }
            getProfile();
        }
    }, [userId])


    const handleLogout = async (e) => {
        e.preventDefault();

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout failed:", error.message);
        } else {
            console.log("Logout successful");
            navigate('/login');
        }
    }

    const [dashboard, setDashboard] = useState(true)
    const [dashboardHold, setDashboardHold] = useState('bg-white')
    const setDashboardDisplay = (e) => {
        e.preventDefault();
        setDashboard(true);
        setDashboardHold('bg-white');
        setUpload(false);
        setUploadHold('');
        setTrends(false);
        setTrendsHold('');
        setAskAI(false);
        setAskAIHold('');
        setReports(false);
        setreportsHold('');
    }

    const [upload, setUpload] = useState(false)
    const [uploadHold, setUploadHold] = useState('')
    const setUploadDisplay = (e) => {
        e.preventDefault();
        setUpload(true);
        setUploadHold('bg-white');
        setDashboard(false);
        setDashboardHold('');
        setTrends(false);
        setTrendsHold('');
        setAskAI(false);
        setAskAIHold('');
        setReports(false);
        setreportsHold('');
    }

    const [trends, setTrends] = useState(false)
    const [trendsHold, setTrendsHold] = useState('')
    const setTrendsDisplay = (e) => {
        e.preventDefault();
        setTrends(true);
        setTrendsHold('bg-white');
        setDashboard(false);
        setDashboardHold('');
        setUpload(false);
        setUploadHold('');
        setAskAI(false);
        setAskAIHold('');
        setReports(false);
        setreportsHold('');
    }

    const [askAI, setAskAI] = useState(false)
    const [askAIHold, setAskAIHold] = useState('')
    const setAskAIDisplay = (e) => {
        e.preventDefault();
        setAskAI(true);
        setAskAIHold('bg-white');
        setTrends(false);
        setTrendsHold('');
        setDashboard(false);
        setDashboardHold('');
        setUpload(false);
        setUploadHold('');
        setReports(false);
        setreportsHold('');
    }

    const [reports, setReports] = useState(false)
    const [reportsHold, setreportsHold] = useState('')
    const setReportsDisplay = (e) => {
        e.preventDefault();
        setReports(true);
        setreportsHold('bg-white');
        setAskAI(false);
        setAskAIHold('');
        setTrends(false);
        setTrendsHold('');
        setDashboard(false);
        setDashboardHold('');
        setUpload(false);
        setUploadHold('');
    }


    return (
        <>
            {popup && <div className='absolute w-full h-screen flex justify-center items-center bg-black/80 z-50 overflow-x-hidden'>
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
                                }} />
                        </div>
                        <div>
                            <div className='text-xl pt-5 text-gray-700'>Age</div>
                            <input type="text" className='w-full border-zinc-500 px-3 py-3 rounded border-1 focus:ring-0 outline-0 focus:border-blue-400' value={age}
                                onChange={(e) => {
                                    ageHandler(e);
                                }} />
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



            <div className='mt-35 px-5 lgpx-20 xl:px-70 overflow-x-hidden w-full'>
                <div className='text-2xl lg:text-4xl'>Welcome back, {profileData?.full_name || 'there'}! 👋</div>
                <div className="lg:text-lg text-gray-600">
                    We're excited to help you take charge of your health journey.
                </div>

                <div className="mt-5 bg-gray-200 shadow rounded-lg p-1 flex flex-col sm:flex-row w-full justify-around drop-shadow-md">
                    <div className={`text-zinc-800 cursor-pointer w-full text-center py-1 rounded ${dashboardHold}`} onClick={(e) => {
                        setDashboardDisplay(e);
                    }}>Dashboard</div>
                    <div className={`text-zinc-800 cursor-pointer w-full text-center py-1 rounded ${uploadHold}`} onClick={(e) => {
                        setUploadDisplay(e);
                    }}>Upload</div>
                    <div className={`text-zinc-800 cursor-pointer w-full text-center py-1 rounded ${trendsHold}`} onClick={(e) => {
                        setTrendsDisplay(e);
                    }}>Trends</div>
                    <div className={`text-zinc-800 cursor-pointer w-full text-center py-1 rounded ${askAIHold}`} onClick={(e) => {
                        setAskAIDisplay(e);
                    }}>Ask AI</div>
                    <div className={`text-zinc-800 cursor-pointer w-full text-center py-1 rounded ${reportsHold}`} onClick={(e) => {
                        setReportsDisplay(e);
                    }}>Reports</div>
                </div>

                {dashboard && <Dashboard />}

                {upload && <Upload />}

                {trends && <Trends />}
                <div className='h-full w-full'>
                    {askAI && <AskAI />}
                </div>
                <div className='h-full w-full'>
                {reports && <Reports />}
                </div>
            </div>
        </>
    )

}

export default Landing