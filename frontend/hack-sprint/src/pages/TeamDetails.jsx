import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getDashboard } from '../backendApis/api';
import {
  Users, Crown, Mail, Check, X, Copy,
  User, Clock, Shield, Link as LinkIcon
} from 'lucide-react';
import { Button } from '../components/Button';

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
  const [isLeader, setIsLeader] = useState(false);
  const [teamData, setTeamData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedItem, setCopiedItem] = useState(null);

  const getStoredTeamCode = useCallback(() => {
    if (teamId) {
      return teamId
    } else {
      return localStorage.getItem(`teamDetails_code`);
    }
  }, [teamId]);

  const fetchTeamData = useCallback(async (user) => {
    if (!user) return;

    const secretCode = getStoredTeamCode();
    // console.log(secretCode)

    try {
      if (secretCode) {
        const teamSearchResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/team/search/${secretCode}`);
        const basicTeamData = teamSearchResponse.data.team;
        // console.log(basicTeamData)

        const pendingResponse = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/team/pendingRequests`, { leaderId: basicTeamData.leader._id });
        setTeamData({ ...basicTeamData, pendingMembers: pendingResponse.data });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error fetching team data.');
    } finally {
      setLoading(false);
    }
  }, [teamId, hackathonId, getStoredTeamCode]);

  useEffect(() => {
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

  useEffect(() => {
    if (currentUser && teamData) {
      const leaderStatus = currentUser._id === teamData.leader._id;
      setIsLeader(leaderStatus);
    }
  }, [currentUser, teamData]);

  useEffect(() => {
    if (!currentUser) return;

    fetchTeamData(currentUser);

    const interval = (() => {
      fetchTeamData(currentUser);
    });

    return () => clearInterval(interval);
  }, [currentUser, fetchTeamData]);

  const handleCopy = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedItem(type);
      setTimeout(() => setCopiedItem(null), 2000);
    });
  };

  const handleRequestAction = async (applicantUserId, action) => {
    setActionLoading(true);
    try {
      const payload = {
        leaderId: teamData.leader._id,
        userId: applicantUserId,
        action: action,
      };

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/team/handleRequest`, payload);
      toast.success(response.data.message);

      fetchTeamData(currentUser);
    } catch (error) {
      toast.error(error.response?.data?.message || `Error ${action}ing request.`);
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
  const spotsRemaining = teamData.maxTeamSize - currentMembers.length;
  const showInviteSection = teamData.code && teamData.secretLink;
  // console.log(currentMembers.length)
  // console.log(teamData.maxTeamSize)

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <GridBackground />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{teamData.name}</h1>
          <p className="text-gray-400">
            Created on {formatDate(teamData.createdAt)} • {currentMembers.length}/{teamData.maxTeamSize} members
          </p>
        </div>

        {isLeader && (
          <>
            {spotsRemaining > 0 && (
              <div className="bg-gray-800/30 border border-green-500/20 overflow-hidden rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-green-400" />
                  Invite Team Members
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Invite Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Invite Code
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-700/50 border border-green-500/20 rounded-lg">
                      <span
                        className="flex-1 font-mono text-green-300 break-all md:truncate"
                        title={teamData.code} // shows full value on hover if truncated
                      >
                        {teamData.code}
                      </span>
                      <Button
                        onClick={() => handleCopy(teamData.code, "code")}
                        className="p-2 bg-green-500/10 text-green-300 hover:bg-green-500/20"
                      >
                        {copiedItem === "code" ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>

                  {/* Invite Link */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Invite Link
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-700/50 border border-green-500/20 rounded-lg">
                      <span
                        className="flex-1 font-mono text-green-300 break-all md:truncate"
                        title={teamData.secretLink} // shows full link on hover if truncated
                      >
                        {teamData.secretLink}
                      </span>
                      <Button
                        onClick={() => handleCopy(teamData.secretLink, "link")}
                        className="p-2 bg-green-500/10 text-green-300 hover:bg-green-500/20"
                      >
                        {copiedItem === "link" ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
