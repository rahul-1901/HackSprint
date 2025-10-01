import axios from 'axios';
import { useState, useEffect } from "react";
import { HeroSection } from "../hackathon/Hero-section";
import { SidebarNav } from "../hackathon/Sidebar-nav";
import { ContentSection } from "../hackathon/Content-section";
import { SocialShare } from "../hackathon/Social-share";
import { useParams } from 'react-router-dom';

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

const Loader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="relative">
            <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-green-400"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-transparent border-b-transparent border-dashed rounded-full animate-spin border-green-600"
                style={{ animationDirection: "reverse", animationDuration: "1.5s" }}>
            </div>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-400 text-xs font-mono">
                LOADING
            </span>
        </div>
    </div>
);

export default function HackathonDetails() {
    const { id } = useParams();
    const [hackathon, setHackathon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("overview");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${id}`);
                if (!res.data) {
                    setError("Hackathon not found");
                    setHackathon(null);
                } else {
                    setHackathon(res.data);
                }
                // console.log(res.data)
            } catch (err) {
                console.error(err);
                setError("Failed to load hackathon details. Please try again later.");
                setHackathon(null);
            }
            setLoading(false);
        };
        loadData();
    }, [id]);

    if (loading) return <Loader />;

    if (error)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-center p-8 relative">
                <GridBackground />
                <div className="bg-gray-900/80 backdrop-blur-sm border border-red-500/30 rounded-xl p-8 shadow-2xl shadow-red-500/10">
                    <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Page</h2>
                    <p className="text-gray-400 font-mono">{error}</p>
                </div>
            </div>
        );

    // CORRECTED LOGIC: Determine active state from the end date for reliability.
    const isHackathonActive = new Date() < new Date(hackathon.endDate);

    return (
        <div className="min-h-screen bg-gray-900 relative">
            <GridBackground />
            <div className="relative z-10">
                <HeroSection
                    title={hackathon.title}
                    subTitle={hackathon.subTitle}
                    isActive={isHackathonActive}
                    startDate={hackathon.startDate}
                    endDate={hackathon.endDate}
                    participantCount={hackathon.numParticipants || 0}
                    prizeMoney1={hackathon.prizeMoney1}
                    prizeMoney2={hackathon.prizeMoney2}
                    prizeMoney3={hackathon.prizeMoney3}
                    imageUrl="/assets/hackathon-banner.png"
                    hackathonId={hackathon._id}
                    submissionStartDate={hackathon?.submissionStartDate}
                    submissionEndDate={hackathon?.submissionEndDate}
                />
                <div className="flex flex-col lg:flex-row max-w-screen-2xl mx-auto">
                    <SidebarNav
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                    />
                    <ContentSection activeSection={activeSection} hackathon={hackathon} />
                    <div className="hidden lg:block">
                        <SocialShare />
                    </div>
                </div>
            </div>
        </div>
    );
}