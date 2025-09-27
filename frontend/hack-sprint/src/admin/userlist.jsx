import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, CheckCircle, XCircle, ArrowLeft, Shield } from 'lucide-react';
import { getAdminDetails, getAdminHackathonDetail } from '../backendApis/api';

const GridBackground = () => (
  <div className="absolute inset-0 h-full w-full bg-gray-900 bg-grid-white/[0.05] -z-20" />
);

const HackathonUsersPage = () => {
  const { slug } = useParams(); 
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [individualParticipants, setIndividualParticipants] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);

  // 1. Fetch admin details to get adminId
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await getAdminDetails();
        setAdminData(response.data.admin);
      } catch (error) {
        console.error("Auth error, redirecting...", error);
        navigate('/adminlogin');
      }
    };
    fetchAdminData();
  }, [navigate]);

  // 2. Fetch hackathon details using adminId and slug
  useEffect(() => {
    if (adminData && slug) {
      const fetchHackathonData = async () => {
        try {
          const response = await getAdminHackathonDetail({ adminId: adminData.id, hackathonId: slug });
          
          const { hackathon, participantsWithoutTeam, teams } = response.data;
          
          setHackathon(hackathon);
          setIndividualParticipants(participantsWithoutTeam);
          setTeams(teams);

        } catch (error) {
          console.error("Failed to fetch hackathon details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchHackathonData();
    }
  }, [adminData, slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading participants...</p>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Hackathon Not Found</h1>
          <Link to="/Hacksprintkaadminprofile" className="text-green-400 hover:underline">
            Go back to the dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Helper functions check for a nested .submission object
  const hasTeamSubmitted = (team) => !!team.submission;
  const hasUserSubmitted = (participant) => !!participant.submission;

  const navigateToSubmission = (hasSubmitted, path) => {
    if (hasSubmitted) {
      navigate(path);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <GridBackground />
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <header className="my-5">
          <Link to="/Hacksprintkaadminprofile" className="flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 group">
             <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
             Back to Dashboard
          </Link>
          <p className="text-green-400 text-sm font-semibold tracking-wide uppercase">Participants List</p>
          <h1 className="text-4xl sm:text-5xl ZaptronFont -tracking-tight text-green-400 md:text-6xl font-extrabold leading-tight mt-2">{hackathon.title}</h1>
        </header>

        <main className="space-y-12">
          {/* --- TEAMS SECTION --- */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Teams</h2>
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="p-4 font-semibold text-gray-300">Team Name</th>
                      <th className="p-4 font-semibold text-gray-300">Members</th>
                      <th className="p-4 font-semibold text-gray-300 text-center">Submission Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {teams.map(team => {
                      const submitted = hasTeamSubmitted(team);
                      return (
                        <tr 
                          key={team._id} 
                          // KEY CHANGE: Corrected navigation path to match App.jsx route
                          onClick={() => navigateToSubmission(submitted, `/hackathon/${slug}/submission/${team._id}`)}
                          className={`transition-colors ${submitted ? 'hover:bg-gray-800/40 cursor-pointer' : ''}`}
                        >
                          <td className="p-4 font-medium text-white">{team.name}</td>
                          <td className="p-4 text-gray-400">
                            {team.leader && <div className="flex items-center gap-2"><Shield size={14} className="text-yellow-400" /> {team.leader.name} (Leader)</div>}
                            {team.members.map(member => <div key={member._id} className="ml-6">{member.name}</div>)}
                          </td>
                          <td className="p-4 text-center">
                            {submitted ? (
                              <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm"><CheckCircle size={16} /> Submitted</span>
                            ) : (
                              <span className="inline-flex items-center gap-2 bg-gray-500/10 text-gray-400 px-3 py-1 rounded-full text-sm"><XCircle size={16} /> Not Submitted</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {teams.length === 0 && (
                  <div className="text-center p-8 text-gray-500"><Users size={48} className="mx-auto mb-4" />No teams have been formed for this hackathon.</div>
                )}
              </div>
            </div>
          </div>

          {/* --- INDIVIDUAL PARTICIPANTS SECTION --- */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Individual Participants</h2>
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="p-4 font-semibold text-gray-300">Name</th>
                      <th className="p-4 font-semibold text-gray-300">Email</th>
                      <th className="p-4 font-semibold text-gray-300 text-center">Submission Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {individualParticipants.map(participant => {
                      const submitted = hasUserSubmitted(participant);
                      return (
                        <tr 
                          key={participant._id} 
                          // KEY CHANGE: Corrected navigation path to match App.jsx route
                          onClick={() => navigateToSubmission(submitted, `/hackathon/${slug}/submission/${participant.user?._id}`)}
                          className={`transition-colors ${submitted ? 'hover:bg-gray-800/40 cursor-pointer' : ''}`}
                        >
                          <td className="p-4 font-medium text-white">{participant.user?.name || 'N/A'}</td>
                          <td className="p-4 text-gray-400">{participant.user?.email || 'N/A'}</td>
                          <td className="p-4 text-center">
                            {submitted ? (
                              <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-sm"><CheckCircle size={16} /> Submitted</span>
                            ) : (
                              <span className="inline-flex items-center gap-2 bg-gray-500/10 text-gray-400 px-3 py-1 rounded-full text-sm"><XCircle size={16} /> Not Submitted</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {individualParticipants.length === 0 && (
                  <div className="text-center p-8 text-gray-500"><Users size={48} className="mx-auto mb-4" />No individual participants have registered yet.</div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HackathonUsersPage;