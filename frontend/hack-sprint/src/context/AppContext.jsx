import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
        const token = localStorage.getItem("token");
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });

      console.log(data);

      data.success
        ? setUserData(data.userData)
        : toast.error(data.message, {
            className: "text-sm max-w-xs",
          });
    } catch (err) {
      setIsLoggedIn(false);
      toast.error(err.message, {
        className: "text-sm max-w-xs",
      });
    }
  };

  // useEffect(() => {
  //   const publicRoutes = ["/login", "/signup", "/reset-password"];
  //   if (!publicRoutes.includes(window.location.pathname)) {
  //     getUserData();
  //   }
  // }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getUserData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    setIsLoggedIn(true);
  }
}, []);


  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContent.Provider value={value}>{props.children}</AppContent.Provider>
  );
};