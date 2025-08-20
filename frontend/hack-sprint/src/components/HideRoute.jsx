import React, { useState, useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const HideRoute = ({ children }) => {
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(true);

    const navVisible = ["/", "/dashboard", "/quest", "/about", "/hackathons","/hackathon/:id","/hackathon/RegistrationForm"]

    useEffect(() => {
        const isDynamicRoute = matchPath({ path: "/hackathon/:id", exact: true }, location.pathname);
        if (!navVisible.includes(location.pathname) && !isDynamicRoute) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }
    }, [location, navVisible]);

    return <div>{showNavbar && children}</div>;
};

export default HideRoute;