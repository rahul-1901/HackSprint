import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const RouteHandler = ({ setIsAuthenticated, setAuthWait }) => {

    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const userAuthCheck = localStorage.getItem("token")
        if (!!userAuthCheck) {
            setIsAuthenticated(true);
            if (location.pathname === "/account/login" || location.pathname === "/account/signup") {
                navigate("/dashboard")
            }
        } else {
            setIsAuthenticated(false)
        }
        setAuthWait(true)
    }, [location])
    return null;
}

export default RouteHandler