import React from 'react';
import { SiReact, SiCss3 } from "react-icons/si";


const Quest = () => {
    return (
        <div className="relative h-screen bg-[#0b0e1c] text-white pt-40 px-6 md:px-20 font-sans overflow-hidden">

            {/* Heading */}
            <h1 className="text-3xl md:text-5xl leading-tight text-white mb-18">
                Ignite Your Tech Journey with<br />
                HackSprint <span className="text-white">Dev Quests</span>
            </h1>

            {/* Left: Image*/}
            <div className="w-full lg:w-1/2 h-full">
                <img
                    src="/devquest.png"
                    alt="DevQuest Preview"
                    className="w-full h-[350px] object-cover rounded-xl border border-green-400 shadow-[0_0_40px_4px_rgba(34,197,94,0.5)]"
                />
            </div>

            
            <div className="absolute top-[110px] right-[200px] flex flex-col items-end space-y-6">

                {/* Grid of languages symbols*/}
                <div className="grid grid-cols-3 gap-4">
                    {[SiHtml5, SiGithub, SiPython, SiNodedotjs, SiJavascript, SiMysql, SiTensorflow, SiReact, SiCss3].map((Icon, i) => (
                        <Icon key={i} className="w-25 h-25 text-white" />
                    ))}
                </div>

                {/* join daily.... */}
                <div className="text-center text-xl md:text-2xl leading-snug mb-0">
                    <p>Join daily to</p>
                    <p>enhance your skills through</p>
                    <p><span className="font-semibold">Quests</span> and <span className="font-semibold">Coding Challenges</span>.</p>
                </div>

                {/* Question Button */}
                <div className="flex justify-center"></div>
                <button className="bg-black hover:bg-[#0c0c0c] text-white text-xl md:text-5xl px-17 py-7 rounded-xl border-2 border-green-500 shadow-[0_0_20px_3px_rgba(34,197,94,0.5)] transition-all hover:scale-105">
                    Question
                </button>

            </div>
        </div>
    );
};

export default Quest;
