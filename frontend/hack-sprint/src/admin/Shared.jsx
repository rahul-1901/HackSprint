// /pages/Shared.jsx
import React from 'react';
import { Users, Calendar } from 'lucide-react';

// A basic implementation for GridBackground
export const GridBackground = () => (
  <div className="absolute inset-0 h-full w-full bg-slate-900 bg-grid-white/[0.05] -z-20" />
);

// A basic implementation for FloatingParticles
export const FloatingParticles = () => (
  <div 
    className="absolute inset-0 h-full w-full animate-float -z-10" 
    style={{ 
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1' fill='%23fff'/%3E%3C/svg%3E")`,
      opacity: 0.3
    }} 
  />
);

// --- UPDATED HACKATHON CARD ---
export const HackathonCard = ({ hackathon }) => {
  const { title, participants, startDate, endDate, image } = hackathon;

  // Helper function to format dates nicely
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group relative flex flex-col md:flex-row items-center bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
      
      {/* Image Container */}
      <div className="w-full md:w-1/3 h-48 md:h-full overflow-hidden">
        <img
          src={image}
          alt={`${title} banner`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 text-slate-400">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-cyan-400" />
            <span>{participants} Participants</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-cyan-400" />
            <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
          </div>
        </div>
      </div>

      {/* Clickable Overlay */}
      <a href="#" className="absolute inset-0" aria-label={`View details for ${title}`}>
        <span className="sr-only">View details for {title}</span>
      </a>

    </article>
  );
};