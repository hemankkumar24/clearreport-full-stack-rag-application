import React from 'react'
import PdfDropzone from './PDFDrop'
import axios from 'axios';
import useSession from '../hooks/useSession'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase_client';

const Upload = () => {
    const navigate = useNavigate();
    const { session, isLoading } = useSession();
    const userId = session?.user?.id;


    const handleDroppedPdfs = async (files) => {
        if (!isLoading && session) {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
            console.error('Error getting session', error);
            }
            const access_token = data.session.access_token;
            const formData = new FormData();
            formData.append("file", files[0]);
            formData.append("user_id", userId);
            formData.append("access_token", access_token)


            axios.post('http://127.0.0.1:8000/handlepdf', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
        }}

    
    return (
        <>
            <div className="mt-10">
                <div className='text-2xl lg:text-4xl'>Upload Your Report</div>
                <div className='text-1xl text-gray-600 mt-1'>Take the first step towards managing your health with confidence! Securely upload your initial medical report now</div>
                <div className="w-full mt-2">
                    <PdfDropzone onFilesDrop={handleDroppedPdfs} />
                </div>
            </div>
        </>
    )
}

export default Upload