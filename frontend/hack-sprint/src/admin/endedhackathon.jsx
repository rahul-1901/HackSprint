import React from 'react';
import { Square } from 'lucide-react';
import { GridBackground, FloatingParticles, HackathonCard } from './Shared';
import { Link } from 'react-router-dom';

// Data is now centralized in this constant
const allHackathons = [
    { id: 'live-01', slug: "ai-innovators-hackathon", title: "AI Innovators Hackathon", participants: 194, startDate: "2025-09-05T00:00:00Z", endDate: "2025-09-12T23:59:59Z", image: "https://placehold.co/600x400/0D1117/22C55E?text=AI+Live", status: 'live' },
    { id: 'live-02', slug: "quantumverse-challenge", title: "QuantumVerse Challenge", participants: 78, startDate: "2025-09-04T00:00:00Z", endDate: "2025-09-11T23:59:59Z", image: "https://placehold.co/600x400/0D1117/F97316?text=QuantumVerse", status: 'live' },
    { id: 'live-03', slug: "cloud-native-sprint", title: "Cloud Native Sprint", participants: 132, startDate: "2025-09-06T00:00:00Z", endDate: "2025-09-10T23:59:59Z", image: "https://placehold.co/600x400/0D1117/0EA5E9?text=Cloud+Sprint", status: 'live'},
    { id: 'recent-01', slug: "gamedev-gauntlet", title: "GameDev Gauntlet", participants: 250, startDate: "2025-09-08T00:00:00Z", endDate: "2025-09-10T23:59:59Z", image: "https://placehold.co/600x400/0D1117/8B5CF6?text=GameDev", status: 'recent' },
    { id: 'recent-02', slug: "cyber-sentinel-showdown", title: "Cyber Sentinel Showdown", participants: 155, startDate: "2025-09-07T00:00:00Z", endDate: "2025-09-10T23:59:59Z", image: "https://placehold.co/600x400/0D1117/3B82F6?text=Cyber+Sentinel", status: 'recent' },
    { id: 'recent-03', slug: "healthtech-nexus", title: "HealthTech Nexus", participants: 95, startDate: "2025-09-06T00:00:00Z", endDate: "2025-09-12T23:59:59Z", image: "https://placehold.co/600x400/0D1117/EC4899?text=HealthTech", status: 'recent'},
    { id: 'ended-01', slug: "decentralized-future-hack", title: "Decentralized Future Hack", participants: 120, startDate: "2025-09-01T00:00:00Z", endDate: "2025-09-05T23:59:59Z", image: "https://placehold.co/600x400/0D1117/F59E0B?text=Blockchain", status: 'ended' },
    { id: 'ended-02', slug: "eco-coders-challenge", title: "Eco-Coders Challenge", participants: 85, startDate: "2025-08-01T00:00:00Z", endDate: "2025-08-05T23:59:59Z", image: "https://placehold.co/600x400/0D1117/10B981?text=Eco+Challenge", status: 'ended' },
    { id: 'ended-03', slug: "sustainable-cities-jam", title: "Sustainable Cities Jam", participants: 110, startDate: "2025-07-15T00:00:00Z", endDate: "2025-07-20T23:59:59Z", image: "https://placehold.co/600x400/0D1117/65A30D?text=Smart+City", status: 'ended'}
];

const EndedHackathonsPage = () => {
  // Filter the list to only get ended hackathons
  const endedHackathons = allHackathons.filter(h => h.status === 'ended');

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <FloatingParticles />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="text-center my-12 sm:my-16">
          <h1 className="flex items-center justify-center gap-x-4 text-4xl sm:text-5xl md:text-6xl text-white ZaptronFont leading-tight">
            <Square className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14" />
            <span>Ended Hackathons</span>
          </h1>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">An archive of past events. See what was built and who won.</p>
        </header>
        <main>
          <div className="space-y-6">
            {endedHackathons.map((hackathon) => (
               <Link key={hackathon.id} to={`/Hacksprintkaadminprofile/${hackathon.slug}/users`}>
                <HackathonCard hackathon={hackathon} />
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EndedHackathonsPage;