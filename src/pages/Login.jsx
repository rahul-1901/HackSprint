import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { googleAuth } from '../backendApis/api'
import { useGoogleLogin } from '@react-oauth/google'

const Login = () => {
    const [userData, setUserData] = useState([]);

    const responseGoogle = async (authResult) => {
        try {
            if (authResult['code']) {
                const result = await googleAuth(authResult['code']);
                const { name, email } = result.data.user;
                const token = result.data.token;
                localStorage.setItem("userToken", token);
                localStorage.setItem("userEmail", email);
            }
        } catch (error) {
            console.error('Error while req google', error)
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    })

    const githubAuthLogin = () => {
        window.location.assign("https://github.com/login/oauth/authorize?client_id=" + import.meta.env.VITE_GITHUB_CLIENT_ID)
    }

    return (
        <>
            <div className='min-h-screen flex justify-center items-center bg-gray-900'>
                <div className='flex flex-col gap-5 items-center'>
                    <button onClick={googleLogin} className='text-white border-2 border-green-800 px-4 py-2 rounded-xl cursor-pointer'>Google Login</button>
                    <p className='text-white'>------Or-------</p>
                    <button onClick={githubAuthLogin} className='text-white border-2 border-green-800 px-4 py-2 rounded-xl cursor-pointer'>Github Login</button>
                </div>
            </div>
        </>
    )
}

export default Login