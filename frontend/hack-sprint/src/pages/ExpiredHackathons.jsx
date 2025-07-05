import React, { useEffect, useState } from 'react'
import { expiredHackathons } from '../backendApis/api';

function ExpiredHackathons() {
  const [expHackathon, setExpHackathon] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await expiredHackathons();
      console.log("expired hackathon = ", result.data.expiredHackathons)
      setExpHackathon(result.data.expiredHackathons);
    }
    fetchData();
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className='bg-green-400'>
        {expHackathon.map((hackathon, index) => (
          <div key={index} className='text-white'>
            {hackathon.title}
          </div>
        ))}
      </div>

    </div>
  )
}

export default ExpiredHackathons
