// /pages/EndedHackathonsPage.js
import React from 'react';
import { Square } from 'lucide-react';
import { GridBackground, FloatingParticles, HackathonCard } from './Shared';

const endedHackathons = [
    { title: "Decentralized Future Hack", participants: 120, startDate: "2025-09-01T00:00:00Z", endDate: "2025-09-05T23:59:59Z", image: "https://placehold.co/600x400/0D1117/F59E0B?text=Blockchain" },
    { title: "Eco-Coders Challenge", participants: 85, startDate: "2025-08-01T00:00:00Z", endDate: "2025-08-05T23:59:59Z", image: "https://placehold.co/600x400/0D1117/10B981?text=Eco+Challenge" },
    { title: "Sustainable Cities Jam", participants: 110, startDate: "2025-07-15T00:00:00Z", endDate: "2025-07-20T23:59:59Z", image: "https://placehold.co/600x400/0D1117/65A30D?text=Smart+City" },
    { title: "Fintech Frontier", participants: 215, startDate: "2025-06-20T00:00:00Z", endDate: "2025-06-25T23:59:59Z", image: "https://placehold.co/600x400/0D1117/0891B2?text=Fintech" }
];

const EndedHackathonsPage = () => {
  return (
    <div className="relative min-h-screen bg-#111827 text-white overflow-hidden">
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
            {endedHackathons.map((hackathon, index) => (
              <HackathonCard key={index} hackathon={hackathon} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EndedHackathonsPage;