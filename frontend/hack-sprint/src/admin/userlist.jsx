import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { allHackathons, hackathonUsers } from './data.js'; // --- IMPORT DATA ---

const GridBackground = () => (
  <div className="absolute inset-0 h-full w-full bg-gray-900 bg-grid-white/[0.05] -z-20" />
);

const HackathonUsersPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const hackathon = allHackathons.find(h => h.slug === slug);
  const users = hackathonUsers[slug] || [];

  if (!hackathon) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Hackathon Not Found</h1>
          <Link to="/" className="text-green-400 hover:underline">
            Go back to the homepage
          </Link>
        </div>
      </div>
    );
  }

  const handleUserClick = (user) => {
    if (user.hasSubmission) {
      navigate(`/hackathon/${slug}/submission/${user.id}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="my-12">
          <Link to="/Hacksprintkaadminprofile" className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 group">
             <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
             Back to Dashboard
          </Link>
          <p className="text-green-400 text-sm font-semibold tracking-wide uppercase">Participants List</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl text-white font-extrabold leading-tight mt-2">{hackathon.title}</h1>
        </header>

        <main>
          <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="p-4 font-semibold text-gray-300">Name</th>
                    <th className="p-4 font-semibold text-gray-300">Email</th>
                    {/* REMOVED: Registered On Header */}
                    <th className="p-4 font-semibold text-gray-300 text-center">Submission Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {users.map(user => (
                    <tr 
                      key={user.id} 
                      onClick={() => handleUserClick(user)}
                      className={`transition-colors ${user.hasSubmission ? 'hover:bg-gray-800/40 cursor-pointer' : ''}`}
                    >
                      <td className="p-4 font-medium text-white">{user.name}</td>
                      <td className="p-4 text-gray-400">{user.email}</td>
                      {/* REMOVED: Registered On Data Cell */}
                      <td className="p-4 text-center">
                        {user.hasSubmission ? (
                          <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm">
                            <CheckCircle size={16} /> Submitted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 bg-gray-500/10 text-gray-400 px-3 py-1 rounded-full text-sm">
                            <XCircle size={16} /> Not Submitted
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
               {users.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-4" />
                  No participants have registered for this hackathon yet.
                </div>
               )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HackathonUsersPage;