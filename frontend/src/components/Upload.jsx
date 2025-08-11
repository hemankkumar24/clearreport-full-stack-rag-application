import React, { useState } from 'react'
import PdfDropzone from './PDFDrop'
import axios from 'axios';
import useSession from '../hooks/useSession'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase_client';

const Upload = () => {
    const navigate = useNavigate();
    const { session, isLoading } = useSession();
    const userId = session?.user?.id;
    const [loading, setLoading] = useState(false); 

    const handleDroppedPdfs = async (files) => {
        if (!isLoading && session) {
            setLoading(true);
            const { data, error } = await supabase.auth.getSession();
            if (error) {
            console.error('Error getting session', error);
            }
            const access_token = data.session.access_token;
            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("user_id", userId);
            formData.append("access_token", access_token)


            axios.post('https://healthcare-report.chickenkiller.com/handlepdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
        }}

    
    return (
        <>
            <div className="mt-10">
                <div className='text-2xl lg:text-4xl'>Upload Your Report</div>
                <div className='text-1xl text-gray-600 mt-1'>Take the first step towards managing your health with confidence! Securely upload your initial medical report now</div>
                <div className="w-full mt-2">
                    {loading ? (
                        <div className="flex justify-center items-center gap-2 text-blue-600 font-semibold">
                            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                            Processing your report...
                        </div>
                    ) : (
                        <PdfDropzone onFilesDrop={handleDroppedPdfs} />
                    )}
                </div>
            </div>
        </>
    )
}

export default Upload