import axios from 'axios'

export const googleAuth = (code) => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/authInfo?code=${code}`)