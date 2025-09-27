import React, { useState, useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const HideRoute = ({ children }) => {
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(true);

    const navVisible = ["/Hacksprintkaadminprofile","/Hacksprintkaadminprofile/endedhackathons","/Hacksprintkaadminprofile/recentlystarted", "/studenthome", "/dashboard", "/quest", "/about", "/hackathons","/hackathon/:id","/hackathon/RegistrationForm/:id","/leaderboard","/hackathon/:hackathonId/team/:teamId","/Hacksprintkaadminprofile/livehackathons"];

    useEffect(() => {
        const isHackathonDynamic = matchPath({ path: "/hackathon/:id", exact: true }, location.pathname);
        const isRegistrationDynamic = matchPath({ path: "/hackathon/RegistrationForm/:id", exact: true }, location.pathname);
        const isTeamDynamic = matchPath({ path: "/hackathon/:hackathonId/team/:teamId", exact: true }, location.pathname);
        const isAdminSubmissionsDynamic = matchPath({ path: "/Hacksprintkaadminprofile/:slug/usersubmissions", exact: true }, location.pathname);
        
        // --- KEY CHANGE: Added a new matchPath for the user submission route ---
        const isUserSubmissionDynamic = matchPath({ path: "/hackathon/:slug/submission/:userId", exact: true }, location.pathname);

        if (
            !navVisible.includes(location.pathname) &&
            !isHackathonDynamic &&
            !isRegistrationDynamic &&
            !isTeamDynamic &&
            !isAdminSubmissionsDynamic &&
            !isUserSubmissionDynamic
        ) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }
    }, [location]);

    return <div>{showNavbar && children}</div>;
};

export default HideRoute;