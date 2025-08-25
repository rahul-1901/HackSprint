import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getDashboard } from '../backendApis/api'; // To get current user
import {
  Users, Crown, Mail, Check, X, Copy,
  User, Clock, Shield, Link as LinkIcon
} from 'lucide-react';
import { Button } from '../components/Button';

// Consistent grid background from other pages
const GridBackground = () => (
  <div className="absolute inset-0 opacity-10 pointer-events-none">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
          linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)
        `,
        backgroundSize: "30px 30px",
      }}
    />
  </div>
);

const TeamDetails = () => {
  const { hackathonId, teamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [teamData, setTeamData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);

  // Gets just the secret code string from localStorage
  const getStoredTeamCode = useCallback(() => {
    return localStorage.getItem(`teamDetails_code`);
  }, [teamId]);

  const fetchTeamData = useCallback(async (user) => {
    if (!user) return;

    const secretCode = getStoredTeamCode();

    try {

      if (secretCode) {
        // Use the secretCode string directly in the API URL
        const teamSearchResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/team/search/${secretCode}`);
        const basicTeamData = teamSearchResponse.data.team;
        console.log(basicTeamData);

        const pendingResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/team/pendingRequests`, { leaderId: user._id });

        const fullTeamData = {
          ...basicTeamData,
          leader: user,
          pendingMembers: pendingResponse.data,
          maxMembers: 4,
          createdAt: user.createdAt,
        };
        console.log("Fetched full team data:", fullTeamData);
        setTeamData(fullTeamData);
      } else {
        // Fallback method if no invite code is found in storage
        console.warn("No secret code found in storage. Using fallback data fetching.");
        try {
          const pendingResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/team/pendingRequests`, { leaderId: user._id });

          const partialTeamData = {
            name: "Your Team",
            leader: user,
            members: [],
            pendingMembers: pendingResponse.data,
            secretCode: null,
            secretLink: null,
            maxMembers: 4,
            createdAt: user.createdAt,
          };
          setTeamData(partialTeamData);
        } catch (fallbackError) {
          // If even the pending requests fail, create minimal team data
          console.error("Fallback data fetching failed:", fallbackError);
          const minimalTeamData = {
            name: "Your Team",
            leader: user,
            members: [],
            pendingMembers: [],
            secretCode: null,
            secretLink: null,
            maxMembers: 4,
            createdAt: user.createdAt,
          };
          setTeamData(minimalTeamData);
        }
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching team data.');
      console.error('Error fetching team data:', error);
    } finally {
      setLoading(false);
    }
  }, [teamId, hackathonId, getStoredTeamCode]);

  useEffect(() => {
    // Store only the secret code string in localStorage
    if (location.state?.secretCode) {
      localStorage.setItem(`teamDetails_code`, location.state.secretCode);
    }

    const fetchInitialData = async () => {

      try {
        const res = await getDashboard();
        const user = res.data.userData;
        setCurrentUser(user);
        fetchTeamData(user);
      } catch (err) {
        toast.error("You must be logged in to view this page.");
        navigate('/login');
      }
    };

    fetchInitialData();
  }, [hackathonId, teamId, navigate, fetchTeamData, location.state]);

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const handleRequestAction = async (applicantUserId, action) => {
    setActionLoading(true);
    try {
      const payload = {
        leaderId: currentUser._id,
        userId: applicantUserId,
        action: action,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/team/handleRequest`, payload);
      toast.success(response.data.message);


      // Refresh data to show updated member/request list
      fetchTeamData(currentUser);

    } catch (error) {
      toast.error(error.response?.data?.message || `Error ${action}ing request.`);
      console.error(`Error ${action}ing request:`, error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const isLeader = currentUser?._id === teamData?.leader?._id;

  const MemberCard = ({ member, isLeaderCard = false }) => (
    <div className="bg-gray-800/50 border border-green-500/20 rounded-lg p-4 hover:border-green-400/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-400/10 rounded-full flex items-center justify-center border border-green-500/20">
            {isLeaderCard ? <Crown className="w-5 h-5 text-green-400" /> : <User className="w-5 h-5 text-green-400" />}
          </div>
          <div>
            <h3 className="text-white font-semibold">{member.name}</h3>
            <p className="text-xs text-gray-400">
              {isLeaderCard ? 'Team Leader' : 'Member'} • Joined {formatDate(member.joinedAt)}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Mail className="w-4 h-4 text-green-400" />
          <span>{member.email}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <Shield className="w-4 h-4 text-green-400" />
          <span>{member.yearsOfExperience || 'N/A'} years experience</span>
        </div>
      </div>
    </div>
  );

  const PendingRequestCard = ({ request }) => (
    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-4 hover:border-yellow-400/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400/10 rounded-full flex items-center justify-center border border-yellow-500/20">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{request.name}</h3>
            <p className="text-xs text-gray-400">
              Requested {formatDate(request.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => handleRequestAction(request._id, 'accept')}
            className="p-2 bg-green-500/10 text-green-300 hover:bg-green-500/20 border border-green-500/20"
            disabled={actionLoading}
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleRequestAction(request._id, 'reject')}
            className="p-2 bg-red-500/10 text-red-300 hover:bg-red-500/20 border border-red-500/20"
            disabled={actionLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <Mail className="w-4 h-4 text-green-400" />
          <span>{request.email}</span>
        </div>
      </div>
    </div>
  );

  if (loading || !teamData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading team details...</p>
        </div>
      </div>
    );
  }


  const currentMembers = [teamData.leader, ...teamData.members];
  const spotsRemaining = teamData.maxMembers - currentMembers.length;
  const showInviteSection = teamData.secretCode && teamData.secretLink;


  return (
    <div className="min-h-screen bg-gray-900 relative">
      <GridBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{teamData.name}</h1>
          <p className="text-gray-400">
            Created on {formatDate(teamData.createdAt)} • {currentMembers.length}/{teamData.maxMembers} members
          </p>
        </div>

        {/* Team Code and Invite Link Section - Only show if we have the data */}
        {showInviteSection && (
          <div className="bg-gray-800/30 border border-green-500/20 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-green-400" />
              Team Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Team Code</label>
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-lg font-mono tracking-widest bg-gray-800/60 border border-green-500/20 rounded-md p-2.5 text-green-300">{teamData.secretCode}</p>
                  <Button onClick={() => handleCopy(teamData.secretCode, 'code')} className="p-2.5 bg-gray-700 hover:bg-gray-600 transition">
                    {copiedItem === 'code' ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-2">Team Invite Link</label>
                <div className="flex items-center gap-2">
                  <p className="flex-1 text-sm truncate bg-gray-800/60 border border-green-500/20 rounded-md p-2.5 text-green-300">{teamData.secretLink}</p>
                  <Button onClick={() => handleCopy(teamData.secretLink, 'link')} className="p-2.5 bg-gray-700 hover:bg-gray-600 transition">
                    {copiedItem === 'link' ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                  </Button>
                </div>
              </div>
              {isLeader && spotsRemaining > 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  Share this code or link with potential team members to invite them to join your team.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Leader-only sections */}
        {isLeader && (
          <>

            {/* Invite Section */}
            {spotsRemaining > 0 && (
              <div className="bg-gray-800/30 border border-green-500/20 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-green-400" />
                  Invite Team Members
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Invite Code</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-700/50 border border-green-500/20 rounded-lg">
                      <span className="flex-1 font-mono text-green-300">{teamData.code}</span>
                      <Button onClick={() => handleCopy(teamData.code, 'code')} className="p-2 bg-green-500/10 text-green-300 hover:bg-green-500/20">
                        {copiedItem === 'code' ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Invite Link</label>
                    <div className="flex items-center gap-2 p-3 bg-gray-700/50 border border-green-500/20 rounded-lg">
                      <span className="flex-1 font-mono text-green-300 truncate">{teamData.secretLink}</span>
                      <Button onClick={() => handleCopy(inviteLink, 'link')} className="p-2 bg-green-500/10 text-green-300 hover:bg-green-500/20">
                        {copiedItem === 'link' ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* Pending Requests */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                Join Requests ({teamData.pendingMembers.length})
              </h2>
              {teamData.pendingMembers.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {teamData.pendingMembers.map((request) => (
                    <PendingRequestCard key={request._id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="border border-gray-600/50 rounded-lg p-8 text-center mb-12">
                  <h3 className="text-lg font-medium text-gray-400">No Pending Requests</h3>
                </div>
              )}
            </div>
          </>
        )}

        {/* Current Team Members */}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-400" />
            Team Members ({currentMembers.length})
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MemberCard member={teamData.leader} isLeaderCard={true} />
            {teamData.members.map((member) => (
              <MemberCard key={member._id} member={member} />
            ))}
            {spotsRemaining > 0 && (
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center flex flex-col justify-center">
                <div className="text-gray-400 mb-2">
                  {spotsRemaining} spot{spotsRemaining > 1 ? 's' : ''} remaining
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
