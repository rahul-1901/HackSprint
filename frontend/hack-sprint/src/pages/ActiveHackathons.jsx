import React, { useEffect, useState } from 'react'
import { activeHackathons } from '../backendApis/api'

function ActiveHackathons() {
    const [livehackathon, setLivehackathon] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const result = await activeHackathons();
            console.log("activehackatons list = ", result.data.allHackathons);
            setLivehackathon(result.data.allHackathons)
        }
        fetchData();
    }, [])

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
                <div className='bg-green-400'>
                    {livehackathon.map((hackathon, index) => (
                        <div key={index} className='text-white'>
                            {hackathon.title}
                        </div>
                    ))}
                </div>

            </div>
        </>
    )
}

export default ActiveHackathons
