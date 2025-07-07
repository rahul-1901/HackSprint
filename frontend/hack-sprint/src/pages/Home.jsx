import React, { useState, useEffect } from 'react'
import Loader from '../components/Loader'
import { Users, Calendar, Timer, ArrowRight } from 'lucide-react'

const Home = () => {

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const sections = document.querySelectorAll('.fade-section');
        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    return (
        <div className=''>

            <Loader />

            <div className="min-h-screen flex items-center justify-center overflow-hidden">
                <p style={{top: '37vh'}} className="absolute text-[180px] ZaptronFont text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-800 tracking-widest z-10">
                    HackSprint
                </p>

                <button
                    className="absolute border-2 border-green-800 right-[1vw] md:right-[0.5vw] text-lg bg-gray-900 hover:bg-gray-800 font-semibold text-gray-400 rounded-lg hover:text-white text-center px-4 py-[5px] transition duration-400 cursor-pointer"
                    style={{ top: '10vh' }}
                >
                    Leaderboard
                </button>
                <div
                    className="absolute border border-green-400 rounded-lg text-white text-center px-4 py-2 max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-1200 cursor-default"
                    style={{ top: '25vh', left: '5vw' }}
                >
                    There's nothing like the bonding experience of fixing a deployment bug five minutes before the deadline. Every error has a lesson—and a panic story worth retelling.
                </div>
                <div
                    className="absolute border border-green-400 rounded-lg text-white text-center px-4 py-2 max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-1200 cursor-default"
                    style={{ top: '25vh', left: '75vw' }}
                >
                    Trust in peer-to-peer systems is tricky. In hackathons, it's easier—we trust that someone will push to main at 3AM without telling anyone and break the build. Tradition, really.
                </div>
                <div
                    className="absolute border border-green-400 rounded-lg text-white text-center px-4 py-2 max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-1200 cursor-pointer"
                    style={{ top: '65vh', left: '5vw' }}
                >
                    Every sprint starts with hope and ends with console.logs. Somewhere in between, there's caffeine, chaos, and the thrill of turning an idea into code that *almost* compiles on the first try.
                </div>
                <div
                    className="absolute border border-green-400 rounded-lg text-white text-center px-4 py-2 max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-1200 cursor-pointer"
                    style={{ top: '65vh', left: '75vw' }}
                >
                    Developers spend nearly 50% of their time just reading code—yet during hackathons, we somehow compress that into 5 minutes and pray the console doesn’t scream. Welcome to peak problem-solving speed.
                </div>
                <div
                    className="absolute border border-green-400 rounded-lg text-white text-center px-4 py-2 max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-120 cursor-default"
                    style={{ top: '75vh', left: '40vw' }}
                >
                    Hackathons are where “MVP” doesn’t just mean Minimum Viable Product—it also stands for "Mostly Violent Pushes" to main. Yet somehow, out of the chaos, a working product emerges, just in time for the final demo.
                </div>
                <div
                    className="absolute border border-green-400 rounded-lg text-white text-center px-4 py-2 max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-1200 cursor-default"
                    style={{ top: '15vh', left: '40vw' }}
                >
                    They said use Git. We did. Now half the time is spent resolving merge conflicts and the other half pretending we understand the last pull request.
                </div>
            </div>

            <div className='flex items-center justify-center mt-30'>
                <div className='flex flex-col w-[80vw]'>
                    <p className='ZaptronFont text-5xl text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-800 flex items-center gap-2'>
                        <span className="h-3 w-3 rounded-full bg-green-300 animate-pulse shadow-lg mt-[-4px]"></span>
                        Active Hackathons
                    </p>
                    <div className='border-1 border-green-200 bg-white/5 fade-section mb-5 cursor-pointer backdrop-blur-sm border border-green-500/20 hover:border-green-700 hover:scale-101 transition duration-300 h-33 px-5 py-5 rounded-xl flex justify-between'>
                        <div className='flex flex-col w-[35%]'>
                            <p className='font-semibold text-2xl text-white/90'>Building HackSprint Platform</p>
                            <p className='text-gray-400 text-sm max-w-2xl mt-[0.5px]'>A centralized platform for hackathon, dev quest's and events</p>
                            <div className='flex items-center gap-8 ml-[-1px] mt-2'>
                                <div className='flex items-center text-sm'>
                                    <Users size={16} className='text-gray-500' /> <span className='ml-1 mt-1 text-gray-400'>500 submissions</span>
                                </div>
                                <div className='flex items-center text-sm'>
                                    <Calendar size={16} className='text-gray-500' /> <span className='ml-1 mt-1 text-gray-400'>10/06/2025 - 20/06/2025</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 h-[40%] bg-green-500/10 px-4 py-2 rounded-full">
                            <Timer size={16} className="text-green-400" />
                            <span className="text-green-400 font-mono mt-[5px]">3d 14h 22m</span>
                        </div>
                    </div>

                    <div className='border-1 border-green-200 bg-white/5 cursor-pointer fade-section backdrop-blur-sm border border-green-500/20 hover:border-green-700 transition duration-300 hover:scale-101 mb-5 h-33 px-5 py-5 rounded-xl flex justify-between'>
                        <div className='flex flex-col w-[35%]'>
                            <p className='font-semibold text-2xl text-white/90'>Building HackSprint Platform</p>
                            <p className='text-gray-400 text-sm max-w-2xl mt-[0.5px]'>A centralized platform for hackathon, dev quest's and events</p>
                            <div className='flex items-center gap-8 ml-[-1px] mt-2'>
                                <div className='flex items-center text-sm'>
                                    <Users size={16} className='text-gray-500' /> <span className='ml-1 mt-1 text-gray-400'>500 submissions</span>
                                </div>
                                <div className='flex items-center text-sm'>
                                    <Calendar size={16} className='text-gray-500' /> <span className='ml-1 mt-1 text-gray-400'>10/06/2025 - 20/06/2025</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 h-[40%] bg-green-500/10 px-4 py-2 rounded-full">
                            <Timer size={16} className="text-green-400" />
                            <span className="text-green-400 font-mono mt-[5px]">3d 14h 22m</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex items-center justify-center mt-10'>
                <div className='flex flex-col w-[80vw]'>
                    <div className='flex justify-between items-center'>
                        <p className='ZaptronFont text-5xl text-transparent bg-clip-text bg-gradient-to-r from-red-100 to-red-200 flex items-center gap-2'>
                            <span className="h-3 w-3 rounded-full bg-red-400 animate-pulse shadow-lg mt-[-4px]"></span>
                            Expired Hackathons
                        </p>
                        <button className="text-gray-400 cursor-pointer hover:text-gray-300 flex items-center gap-2 transition-colors">
                            View All <ArrowRight size={16} />
                        </button>
                    </div>
                    <div className='border-1 border-green-200 bg-white/5 mb-5 cursor-pointer fade-section backdrop-blur-sm border border-green-500/20 hover:border-green-700 hover:scale-101 transition duration-300 h-33 px-5 py-5 rounded-xl flex justify-between'>
                        <div className='flex flex-col w-[35%]'>
                            <p className='font-semibold text-2xl text-white/90'>Building HackSprint Platform</p>
                            <p className='text-gray-400 text-sm max-w-2xl mt-[0.5px]'>A centralized platform for hackathon, dev quest's and events</p>
                            <div className='flex items-center gap-8 ml-[-1px] mt-2'>
                                <div className='flex items-center text-sm'>
                                    <Users size={16} className='text-gray-500' /> <span className='ml-1 mt-1 text-gray-400'>500 submissions</span>
                                </div>
                                <div className='flex items-center text-sm'>
                                    <Calendar size={16} className='text-gray-500' /> <span className='ml-1 mt-1 text-gray-400'>10/06/2025 - 20/06/2025</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 h-[40%] bg-green-500/10 px-4 py-2 rounded-full">
                            <Timer size={16} className="text-green-400" />
                            <span className="text-green-400 font-mono mt-[5px]">0d 0h 0m</span>
                        </div>
                    </div>

                    <div className='border-1 mb-40 border-green-200 bg-white/5 cursor-pointer fade-section backdrop-blur-sm border border-green-500/20 hover:border-green-700 transition duration-300 hover:scale-101 mb-5 h-33 px-5 py-5 rounded-xl flex justify-between'>
                        <div className='flex flex-col w-[35%]'>
                            <p className='font-semibold text-2xl text-white/90'>Building HackSprint Platform</p>
                            <p className='text-gray-400 text-sm max-w-2xl mt-[0.5px]'>A centralized platform for hackathon, dev quest's and events</p>
                            <div className='flex items-center gap-8 ml-[-1px] mt-2'>
                                <div className='flex items-center text-sm'>
                                    <Users size={16} className='text-gray-500' /> <span className='ml-1 mt-1 text-gray-400'>500 submissions</span>
                                </div>
                                <div className='flex items-center text-sm'>
                                    <Calendar size={16} className='text-gray-500' /> <span className='ml-1 mt-1 text-gray-400'>10/06/2025 - 20/06/2025</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 h-[40%] bg-green-500/10 px-4 py-2 rounded-full">
                            <Timer size={16} className="text-green-400" />
                            <span className="text-green-400 font-mono mt-[5px]">0d 0h 0m</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
