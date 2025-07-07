import React from 'react'
import Loader from '../components/Loader'

const Quest = () => {
    return (
        <>
            <Loader />
            <div className='min-h-screen bg-gray-900 flex items-center justify-center ZaptronFont'>
                <p className='text-[120px] text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-800'>Grind the Stack</p>
            </div>
        </>
    )
}

export default Quest