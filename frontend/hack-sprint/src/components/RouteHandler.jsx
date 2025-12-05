import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RouteHandler = ({ setIsAuthenticated, setAuthWait }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (userToken) {
      setIsAuthenticated(true);

      if (
        location.pathname === "/account/login" ||
        location.pathname === "/account/signup"
      ) {
        navigate("/dashboard");
      }
    } else if (adminToken) {
      setIsAuthenticated(true);

      if (location.pathname === "/admin/login") {
        navigate("/admin");
      }
    } else {
      setIsAuthenticated(false);
    }

    setAuthWait(true); 
  }, [location, navigate, setIsAuthenticated, setAuthWait]);

  return null;
};

export default RouteHandler;
