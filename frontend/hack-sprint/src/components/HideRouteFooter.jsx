import React, { useState, useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const HideRouteFooter = ({ children }) => {
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(true);

    const footerVisible = ["/","/studenthome","/adminhome","/dashboard", "/quest", "/about", "/hackathons","/hackathon/:id","/hackathon/RegistrationForm/:id","/leaderboard","/hackathon/:hackathonId/team/:teamId"];

    useEffect(() => {
        const isHackathonDynamic = matchPath({ path: "/hackathon/:id", exact: true }, location.pathname);
        const isRegistrationDynamic = matchPath({ path: "/hackathon/RegistrationForm/:id", exact: true }, location.pathname);
        const isTeamDynamic = matchPath({ path: "/hackathon/:hackathonId/team/:teamId", exact: true }, location.pathname);

        if (
            !footerVisible.includes(location.pathname) &&
            !isHackathonDynamic &&
            !isRegistrationDynamic &&
            !isTeamDynamic
        ) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }
    }, [location, footerVisible]);

    return <div>{showNavbar && children}</div>;
};

export default HideRouteFooter;