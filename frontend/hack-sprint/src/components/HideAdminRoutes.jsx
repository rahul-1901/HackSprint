import React, { useState, useEffect } from 'react';
import { useLocation, matchPath } from 'react-router-dom';

const HideAdminRoutes = ({ children }) => {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(false);

  const adminVisibleRoutes = [
    "/Hacksprintkaadminprofile",
    "/Hacksprintkaadminprofile/endedhackathons",
    "/Hacksprintkaadminprofile/recentlystarted",
    "/Hacksprintkaadminprofile/livehackathons",
    "/createHackathon"
  ];

  useEffect(() => {
    const isAdminDynamic = matchPath(
      { path: "/Hacksprintkaadminprofile/:slug", exact: true },
      location.pathname
    );
    const isAdminSubmissionsDynamic = matchPath({ path: "/Hacksprintkaadminprofile/:slug/usersubmissions", exact: true }, location.pathname);

    if (adminVisibleRoutes.includes(location.pathname) || isAdminDynamic || isAdminSubmissionsDynamic) {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }
  }, [location]);

  return <>{showNavbar && children}</>;
};

export default HideAdminRoutes;
