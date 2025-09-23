// usersubmission.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, AlertTriangle } from 'lucide-react';
import { allHackathons, hackathonUsers, userSubmissions } from './data.js'; // --- IMPORT DATA ---

// --- HELPER COMPONENT ---
const GridBackground = () => (
  <div className="absolute inset-0 h-full w-full bg-gray-900 bg-grid-white/[0.05] -z-20" />
);


// --- MAIN COMPONENT ---
const UserSubmissionDetailPage = () => {
  const { slug, id } = useParams();

  // Logic remains the same, using the imported data
  const hackathon = allHackathons.find(h => h.slug === slug);
  const usersForHackathon = hackathonUsers[slug] || [];
  const user = usersForHackathon.find(u => u.id == id);
  const submission = userSubmissions[id];

  // Handle case where data is not found
  if (!hackathon || !user || !submission) {
    return (
      <div className="relative min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <GridBackground />
        <div className="text-center bg-gray-900/80 backdrop-blur-sm border border-red-500/50 rounded-2xl p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 text-3xl font-bold text-white">Submission Not Found</h1>
          <p className="mt-2 text-gray-400">The requested submission does not exist or could not be loaded.</p>
          <Link 
            to="/" 
            className="mt-6 inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-500/30"
          >
            <ArrowLeft size={16} />
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <header className="my-12">
          <Link 
            to={`/Hacksprintkaadminprofile/${slug}/usersubmissions`} 
            className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 group"
          >
             <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
             Back to Participants List
          </Link>
          <p className="text-sm font-semibold tracking-wide text-green-400 uppercase">{hackathon.title}</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            {submission.title}
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            Submitted by <span className="font-medium text-gray-200">{user.name}</span> ({user.email})
          </p>
        </header>

        <main>
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Submission Details</h2>
            <div className="space-y-4">
              <a 
                href={submission.repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors"
              >
                <Github className="h-6 w-6 text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">GitHub Repository</p>
                  <p className="text-sm text-gray-400 break-all">{submission.repoUrl}</p>
                </div>
              </a>
              <a 
                href={submission.liveDemo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/80 transition-colors"
              >
                <ExternalLink className="h-6 w-6 text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white">Live Demo</p>
                  <p className="text-sm text-gray-400 break-all">{submission.liveDemo}</p>
                </div>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserSubmissionDetailPage;