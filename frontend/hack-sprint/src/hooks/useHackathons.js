import { useQuery } from '@tanstack/react-query';
import { getActiveHackathons, getExpiredHackathons, getUpcomingHackathons } from '../backendApis/api';

export const useHackathons = () => {
  return useQuery({
    queryKey: ['hackathons'],
    queryFn: async () => {
      const [activeRes, expiredRes, upcomingRes] = await Promise.all([
        getActiveHackathons(),
        getExpiredHackathons(),
        getUpcomingHackathons(),
      ]);

      const mapData = (data, status) =>
        (data || []).map((h) => ({
          ...h,
          status: status,
          participants: h.numParticipants || 0,
          prize: h.prizeMoney,
          techStack: h.techStackUsed || [],
          category: h.category || "General",
          image: h.image || h.imageUrl || null,
          dates: `${new Date(h.startDate).toLocaleDateString()} - ${new Date(h.submissionEndDate).toLocaleDateString()}`,
        }));

      return {
        active: mapData(activeRes.data.allHackathons, "active"),
        expired: mapData(expiredRes.data.expiredHackathons, "expired"),
        upcoming: mapData(upcomingRes.data.upcomingHackathons, 'upcoming'),
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
