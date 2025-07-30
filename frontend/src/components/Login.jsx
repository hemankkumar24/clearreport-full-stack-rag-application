import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase_client';
import useSession from '../hooks/useSession';

const Login = () => {
    const navigate = useNavigate();
    const { session, isLoading } = useSession();

    useEffect(() => {
        if (!isLoading && session) {
            navigate('/dashboard');
        }
        }, [isLoading, session, navigate]);


    const [email_data, setEmailData] = useState("");
    const changeEmail = (e) => {
        e.preventDefault();
        setEmailData(e.target.value);
    }

    const [password_data, setPasswordData] = useState("");
    const changePassword = (e) => {
        e.preventDefault();
        setPasswordData(e.target.value);
    }

    const handleSubmit = async (data) => {
        const { error: loginERROR } = await supabase.auth.signInWithPassword({
            email: data.email, password: data.password
        })
        if (loginERROR) {
            console.log("Error logging in:", loginERROR.message);
        }
        else {
            console.log("Successful Login");
            navigate('/dashboard');
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        console.log("email_data", email_data);
        console.log("password_data", password_data);

        handleSubmit({ "email": email_data, "password": password_data })

        setPasswordData('');
        setEmailData('');
    }



    return (
        <div className='flex justify-center items-center h-full w-full'>
            <div className='flex h-[60%] w-[45%] shadow-xl object-cover'>
                <div className='w-1/1 hidden md:block'>
                    <img src="/public/images/signin.jpg" alt=""
                        className='object-cover w-full h-full' />
                </div>
                <div className='w-full p-7 flex flex-col justify-center'>
                    <h1 className='text-4xl'>Welcome Back!</h1>
                    <h1 className='text pt-1 w-full'>Sign in to continue to your dashboard.</h1>
                    <div className='flex flex-col w-full flex-start justify-center items-center'>
                        <form className='pt-10 w-full' onSubmit={(e) => {
                            submitHandler(e);
                        }
                        }>
                            <div><div>Email</div>
                                <input type="text" className='w-full border-2 border-zinc-500 px-3 py-3 rounded'
                                    value={email_data}
                                    onChange={(e) => {
                                        changeEmail(e);
                                    }} />
                            </div>
                            <div><div className='pt-4'>Password</div>
                                <input type="text" className='w-full border-2 border-zinc-500 px-3 py-3 rounded'
                                    value={password_data}
                                    onChange={(e) => {
                                        changePassword(e);
                                    }} />
                            </div>
                            <div>
                                <button className='w-full bg-emerald-400 rounded text-white text-xl py-3 mt-3 cursor-pointer hover:bg-emerald-500'>Login</button>
                            </div>
                        </form>
                        <div className='mt-10'>Create an account? <Link to='/signup' className='text-blue-600'>Sign Up</Link></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login