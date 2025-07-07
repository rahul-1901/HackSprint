import React, { useEffect, useState } from 'react';

const Loader = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        setTimeout(() => {
            setOpacity(0);
        }, 1000);

        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    if (!isLoading) return null;

    return (
        <div
            className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center overflow-hidden"
            style={{
                transition: 'opacity 1s ease-in-out',
                opacity: opacity,
                width: '100vw',
                height: '100vh',
                maxWidth: '100%',
                touchAction: 'none'
            }}
        >
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[40rem] h-[90vw] max-h-[40rem] bg-green-500/20 rounded-full blur-[100px] animate-pulse" />
            </div>

            <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-gray-900
 bg-[size:50px_50px] opacity-20"/>
            
            {/* Center container with fixed positioning */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center w-full max-w-full px-4">
                <div className="relative w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center">
                    <img
                        src="/hackSprint.webp"
                        className="w-full h-full object-contain animate-float"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))' }}
                        alt="HackSprint Logo"
                    />

                    <div className="absolute inset-[-10px] border-2 border-green-500/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    <div className="absolute inset-[-20px] border-2 border-green-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                </div>

                <div className="mt-8">
                    <div className="flex space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-[bounce_1.5s_infinite_0ms] opacity-80"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-[bounce_1.5s_infinite_300ms] opacity-80"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-[bounce_1.5s_infinite_600ms] opacity-80"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loader;