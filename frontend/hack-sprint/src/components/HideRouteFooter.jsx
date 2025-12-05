import React, { useState, useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const HideRouteFooter = ({ children }) => {
    const location = useLocation();
    const [showNavbar, setShowNavbar] = useState(true);

    const footerVisible = ["/createHackathon", "/", "/studenthome", "/adminhome", "/dashboard", "/quest", "/about", "/hackathons", "/hackathon/:id", "/hackathon/RegistrationForm/:id", "/leaderboard", "/hackathon/:hackathonId/team/:teamId", "/admin", "/admin/livehackathons", "/admin/recentlystarted", "/admin/endedhackathons"];

    useEffect(() => {
        const isHackathonDynamic = matchPath({ path: "/hackathon/:id", exact: true }, location.pathname);
        const isRegistrationDynamic = matchPath({ path: "/hackathon/RegistrationForm/:id", exact: true }, location.pathname);
        const isTeamDynamic = matchPath({ path: "/hackathon/:hackathonId/team/:teamId", exact: true }, location.pathname);
        const isAdminSubmissionsDynamic = matchPath({ path: "/admin/:slug/usersubmissions", exact: true }, location.pathname);

        // --- KEY CHANGE: Added a new matchPath for the user submission route ---
        const isUserSubmissionDynamic = matchPath({ path: "/hackathon/:slug/submission/:userId", exact: true }, location.pathname);

        if (
            !footerVisible.includes(location.pathname) &&
            !isHackathonDynamic &&
            !isRegistrationDynamic &&
            !isTeamDynamic &&
            !isAdminSubmissionsDynamic &&
            !isUserSubmissionDynamic // --- KEY CHANGE: Added the new check to the condition ---
        ) {
            setShowNavbar(false);
        } else {
            setShowNavbar(true);
        }
    }, [location]);

    return <div>{showNavbar && children}</div>;
};

export default HideRouteFooter;