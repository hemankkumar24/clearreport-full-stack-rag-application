import { useNavigate } from 'react-router-dom';
import useSession from '../hooks/useSession'
import { useEffect, useState } from 'react';

const Protected = ({ children }) => {
    const navigate = useNavigate()
    const { session, isLoading } = useSession();

    useEffect(() => {
        if(!isLoading && !session)
        {
        navigate('/login');
        }
    },[isLoading, session])
    
    if(isLoading)
    {
            return <div>Loading...</div>
    }

    if (session && !isLoading)
    {
            return children;
    }
    
    return null;
}

export default Protected;