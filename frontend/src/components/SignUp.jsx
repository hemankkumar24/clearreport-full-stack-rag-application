import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabase_client';

const Signin = () => {

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

    const [confirmpassword_data, setConfirmPasswordData] = useState("");
    const changeConfirmPassword = (e) => {
        e.preventDefault();
        setConfirmPasswordData(e.target.value);
    }

    const handleSubmit = async (data) => {
        const { data: userData, error: signUpERROR } = await supabase.auth.signUp({email: data.email,password: data.password})

        console.log(userData);
        if (signUpERROR)
        {
            console.log("Error signing up:", signUpERROR.message);
        }
        const user_id = userData.user.id; 
        const { error: createProfileERROR } = await supabase.from("profiles").insert([{ id: user_id }]);

        if (createProfileERROR)
        {
            console.log("Error creating profile:", createProfileERROR.message);
        }
        else
        {
            console.log("Created Profile Successfully!");
        }


    }

    const submitHandler = (e) => {
        e.preventDefault();
        console.log("email_data", email_data);
        console.log("password_data", password_data);
        console.log("confirmpassword_data", confirmpassword_data);

        handleSubmit({"email": email_data, "password":password_data})

        if (password_data !== confirmpassword_data) {
            alert("Passwords do not match.");
            return;
        }

        setConfirmPasswordData('');
        setPasswordData('');
        setEmailData('');
    }

    return (
        <div className='flex justify-center items-center h-full w-full'>
            <div className='flex xl:h-[70%] xl:w-[55%] shadow-xl object-cover'>
                <div className='w-1/1 hidden lg:block'>
                <img src="/images/signin.jpg" alt="" 
                className='object-cover w-full h-full'/>
                </div>
                <div className='w-full p-5 flex flex-col justify-center'>
                <h1 className='text-4xl'>Create Your Account</h1>
                <h1 className='text pt-1'>Get started in seconds and unlock your potential.</h1>
                <div className='flex flex-col w-full flex-start justify-center items-center'>
                    <form className='pt-5 w-full'
                    onSubmit={(e) => {
                        submitHandler(e);
                    }}>
                        <div><div>Email</div>
                            <input type="email" className='w-full border-2 border-zinc-500 px-3 py-3 rounded' 
                             value={email_data} 
                                onChange={(e) => {
                                    changeEmail(e);
                                }}/>
                        </div>
                        <div><div className='pt-4'>Password</div>
                            <input type="password" className='w-full border-2 border-zinc-500 px-3 py-3 rounded' 
                            value={password_data}
                                onChange={(e) => {
                                    changePassword(e);
                                }}/>
                        </div>
                        <div><div className='pt-4'>Confirm Password</div>
                            <input type="password" className='w-full border-2 border-zinc-500 px-3 py-3 rounded' 
                            value={confirmpassword_data}
                            onChange={(e) => {
                                changeConfirmPassword(e);
                            }}/>
                        </div>
                        <div>
                            <button className='w-full bg-emerald-400 rounded text-white text-xl py-3 mt-3 cursor-pointer hover:bg-emerald-500'>Sign Up</button>
                        </div>
                    </form>
                    <div className='mt-10'>Already have an account? <Link to='/login' className='text-blue-600'>Login</Link></div>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Signin