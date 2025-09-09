// /pages/RecentlyStartedPage.js
import React from 'react';
import { Activity } from 'lucide-react';
import { GridBackground, FloatingParticles, HackathonCard } from './Shared';

const recentlyStartedHackathons = [
    { title: "GameDev Gauntlet", participants: 250, startDate: "2025-09-08T00:00:00Z", endDate: "2025-09-10T23:59:59Z", image: "https://placehold.co/600x400/0D1117/8B5CF6?text=GameDev" },
    { title: "Cyber Sentinel Showdown", participants: 155, startDate: "2025-09-07T00:00:00Z", endDate: "2025-09-10T23:59:59Z", image: "https://placehold.co/600x400/0D1117/3B82F6?text=Cyber+Sentinel" },
    { title: "HealthTech Nexus", participants: 95, startDate: "2025-09-06T00:00:00Z", endDate: "2025-09-12T23:59:59Z", image: "https://placehold.co/600x400/0D1117/EC4899?text=HealthTech" },
];

const RecentlyStartedPage = () => {
  return (
    <div className="relative min-h-screen bg-#111827 text-white overflow-hidden">
      <GridBackground />
      <FloatingParticles />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="text-center my-12 sm:my-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-white ZaptronFont leading-tight">Recently Started</h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">Catch the momentum! These hackathons have just kicked off.</p>
        </header>
        <main>
          <div className="space-y-6">
            {recentlyStartedHackathons.map((hackathon, index) => (
              <HackathonCard key={index} hackathon={hackathon} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecentlyStartedPage;