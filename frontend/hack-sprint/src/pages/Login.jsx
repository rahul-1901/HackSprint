import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { googleAuth } from '../backendApis/api'
import { useGoogleLogin } from '@react-oauth/google'

const Login = () => {
    const [userData, setUserData] = useState([]);

    const responseGoogle = async (authResult) => {
        try {
            if(authResult['code']) {
                const result = await googleAuth(authResult['code']);
                const {name, email} = result.data.user;
                const token = result.data.token;
                // console.log(result);
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

    return (
        <>
            <div className='min-h-screen flex justify-center items-center bg-gray-900'>
                <button onClick={googleLogin} className='text-white border-2 border-green-800 px-4 py-2 rounded-xl cursor-pointer'>Google Login</button>
            </div>
        </>
    )
}

export default Login