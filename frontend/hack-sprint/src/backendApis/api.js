import axios from 'axios'
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export const googleAuth = (code) => API.get(`/api/account/google?code=${code}`) // API.get(`/api/authInfo?code=${code}`)

export const getDashboard = () => {
  const token = localStorage.getItem("token");

  return axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/userData`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addConnectedApp = (data) => {
  API.post("/api/user/addConnectedApps", data)
}  

export const editConnectedApp = (data) => {
  API.put("/api/user/editConnectedApps", data)
}

export const deleteConnectedApp = (data) => {
  API.delete("/api/user/deleteConnectedApps", { data })
}

export const addEducation = (data) => {
  API.post("/api/user/addEducation", data)
}  

export const editEducation = (data) => {
  API.put("/api/user/editEducation", data)
}

export const deleteEducation = (data) => {
  API.delete("/api/user/deleteEducation", { data })
}

export const addLanguages = ({ userId, language }) => {
  return API.post("/api/user/addLanguages", { userId, language });
};

export const deleteLanguages = ({ userId, language }) => {
  return API.delete("/api/user/deleteLanguages", {
    data: { userId, language } 
  });
};

export const addSkills = ({ userId, skill }) => {
  return API.post("/api/user/addSkills", { userId, skill });
};

export const deleteSkills = ({ userId, skill }) => {
  return API.delete("/api/user/deleteSkills", {
    data: { userId, skill } 
  });
};
