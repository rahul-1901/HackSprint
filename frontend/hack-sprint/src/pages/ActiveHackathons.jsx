 import React, { useEffect, useState } from 'react';
// KEY CHANGE: Use the correct exported function name
import { getActiveHackathons } from '../backendApis/api';

function ActiveHackathons() {
    const [livehackathon, setLivehackathon] = useState([]);

    useEffect(() => {
        async function fetchData() {
            // KEY CHANGE: Call the function with its correct name
            const result = await getActiveHackathons();
            console.log("activehackatons list = ", result.data.allHackathons);
            setLivehackathon(result.data.allHackathons);
        }
        fetchData();
    }, []);

    return (
        <>
            {/* <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
                <div className='bg-green-400'>
                    {livehackathon.map((hackathon, index) => (
                        <div key={index} className='text-white'>
                            {hackathon.title}
                        </div>
                    ))}
                </div>
            </div>*/}
        </>
    );
}

export default ActiveHackathons;