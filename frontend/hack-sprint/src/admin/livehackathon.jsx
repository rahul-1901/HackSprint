import React from 'react';
import { Play } from 'lucide-react';
import { GridBackground, FloatingParticles, HackathonCard } from './Shared';
import { Link } from 'react-router-dom';
import { allHackathons } from './data.js'; // --- IMPORT DATA ---

const LiveHackathonsPage = () => {
  // Filter the list to only get live hackathons
  const liveHackathons = allHackathons.filter(h => h.status === 'live');

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <FloatingParticles />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="text-center my-12 sm:my-16">
          <h1 className="flex items-center justify-center gap-x-4 text-4xl sm:text-5xl md:text-6xl text-white ZaptronFont leading-tight">
            <Play className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
            <span>Live Hackathons</span>
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">These events are currently active. Join a team and start building now!</p>
        </header>
        <main>
          <div className="space-y-6">
            {liveHackathons.map((hackathon) => (
              <Link key={hackathon.id} to={`/Hacksprintkaadminprofile/${hackathon.slug}/usersubmissions`}>
                <HackathonCard hackathon={hackathon} />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LiveHackathonsPage;