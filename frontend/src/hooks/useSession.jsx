import React, { use } from 'react'
import { useEffect, useState } from 'react';
import { supabase } from '../supabase_client';


const useSession = () => {
    const [session, setSession] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const checkSession = async () => {
        const checkCurrentSession = await supabase.auth.getSession();
        // console.log(checkCurrentSession);
        setSession(checkCurrentSession.data.session)
        setIsLoading(false);
      }

    useEffect(() => {
        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        )


        return () => {
            authListener.subscription.unsubscribe();
        };
    },[])

      
  return { session, isLoading };
}

export default useSession;