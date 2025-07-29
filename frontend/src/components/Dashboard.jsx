import React from 'react'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const verifyUser = async () => {
        const res = await fetch("http://127.0.0.1:8000/getprofiledata", {
            method: "GET",
            credentials: "include"
        });

        if (res.ok) {
            console.log("Authenticated Continue!");
        }
        else {
            const errorData = await res.json();
            console.error("Authentication failed:", errorData.detail);
            navigate('/')
            }
    }

    verifyUser()
    return (
        <div>
            Testing Dashboard
        </div>
    )
}

export default Dashboard