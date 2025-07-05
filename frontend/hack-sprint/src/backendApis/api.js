import axios from 'axios'

export const googleAuth = (code) => axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/authInfo?code=${code}`)

export const activeHackathons = ()=>{
    return axios.get('http://localhost:3000/api/hackathons/')
    .then((result) => {
        // console.log("data from DB = ",result.data.allHackathons);
        console.log("data from DB = ",result);
        // return result.data.allHackathons
        return result;

    }).catch((err) => {
        console.log(err);
    });
}

export const expiredHackathons = ()=>{
    return axios.get('http://localhost:3000/api/hackathons/expiredHackathons')
    .then((result)=>{
        console.log("data from DB = ",result);
        return result;
    })
    .catch((error)=>{
        console.log(error);
    })
}