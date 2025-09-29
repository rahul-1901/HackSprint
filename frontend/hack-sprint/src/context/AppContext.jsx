import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_API_BASE_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${backendUrl}/api/userData`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(data);
      setIsLoggedIn(true);

      data.success
        ? setUserData(data.userData)
        : console.log("Error...", data.message)
    } catch (err) {
      setIsLoggedIn(false);
      console.log("Error....", err.message)
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