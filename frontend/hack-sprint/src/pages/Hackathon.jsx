import axios from 'axios'
import { useState, useEffect } from "react";
import { HeroSection } from "../hackathon/Hero-section";
import { SidebarNav } from "../hackathon/Sidebar-nav";
import { ContentSection } from "../hackathon/Content-section";
import { SocialShare } from "../hackathon/Social-share";
import { RegistrationForm } from "../hackathon/RegistrationForm";
import { useParams } from 'react-router-dom';

const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-hero-primary"></div>
      <div
        className="absolute inset-0 w-16 h-16 border-4 border-dashed rounded-full animate-spin border-hero-secondary"
        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
      ></div>
    </div>
  </div>
);

export default function HackathonDetails() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [view, setView] = useState("details"); // Can be 'details' or 'form'

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
      } catch (err) {
        console.error(err);
        setError("Hackathon not found!");
        setHackathon(null);
      }
      setLoading(false);
    };
    loadData();
  }, [id]);

  const handleRegister = () => {
    setView("form");
  };

  const handleFormSubmit = async (formData) => {
    try {
      console.log("Submitting registration data to backend:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setView("details");
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-destructive font-mono text-2xl p-8 text-center">
        {error}
      </div>
    );

  if (view === "form") {
    return <RegistrationForm onBack={() => setView("details")} onSubmit={handleFormSubmit} />;
  }

  return (
    <div className="min-h-screen bg-[#101622]">
      <HeroSection
        title={hackathon.title}
        subTitle={hackathon.subTitle}
        isActive={hackathon.status}
        startDate={hackathon.startDate}
        endDate={hackathon.endDate}
        participantCount={hackathon.submissions?.length || 0}
        prizeMoney={hackathon.prizeMoney}
        imageUrl="/assets/hackathon-banner.png"
        hackathonId={hackathon._id}
        onRegister={handleRegister}
      />

      {/* This container now handles the responsive layout */}
      <div className="flex flex-col lg:flex-row">
        <SidebarNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <ContentSection activeSection={activeSection} hackathon={hackathon} />
        
        {/* SocialShare is now wrapped and hidden on screens smaller than 'lg' */}
        <div className="hidden lg:block">
          <SocialShare />
        </div>
      </div>
    </div>
  );
}