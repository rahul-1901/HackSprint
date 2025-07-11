import React from 'react';
import {
  SiHtml5, SiGithub, SiPython, SiNodedotjs,
  SiJavascript, SiMysql, SiTensorflow, SiReact, SiCss3
} from 'react-icons/si';
import QuestImg from '../assets/quest.png';
import './Allcss.css';

const Quest = () => {
  const icons = [
    [SiHtml5, SiGithub, SiPython],
    [SiNodedotjs, SiJavascript, SiMysql],
    [SiTensorflow, SiReact, SiCss3],
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen px-6 md:px-16 lg:px-24 pt-20 bg-[#0b0e1c] text-white font-sans">

      {/* LEFT IMAGE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center mb-8 lg:mb-0">
        <img
          src={QuestImg}
          alt="DevQuest Preview"
          className="w-full max-w-[90%] object-cover rounded-xl shadow-[0_0_40px_4px_rgba(34,197,94,0.4)]"
        />
      </div>

      {/* RIGHT BLOCK */}
      <div className="w-full lg:w-1/2 flex flex-col justify-start items-center lg:pt-6 gap-4">

        {/* 3x3 GRID */}
        <div className="flex flex-col gap-3">
          {icons.map((row, i) => (
            <div key={i} className="flex justify-center gap-6">
              {row.map((Icon, j) => (
                <Icon key={j} className="w-16 h-16 md:w-24 md:h-24 text-white" />
              ))}
            </div>
          ))}
        </div>

        {/* TEXT */}
        <div className="text-center text-base md:text-lg lg:text-xl leading-snug mt-2 px-2">
          <p>Join daily to enhance your skills</p>
          <p>through <span className="font-bold">Quests</span> and <span className="font-bold">Coding</span></p>
          <p>challenges.</p>
        </div>

        {/* BUTTON position changed slightly */}
        <div className="mt-0 w-full flex justify-center relative">
          <button
            className="bgButton text-white text-lg md:text-2xl py-4 px-12 rounded-2xl shadow-lg hover:scale-105 transition-all"
            style={{ transform: 'translate(0.5cm, -0.2cm)' }}
          >
            Question
          </button>
        </div>

      </div>
    </div>
  );
};

export default Quest;
