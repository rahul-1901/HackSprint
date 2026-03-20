import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Trophy,
  ChevronDown,
  Target,
  Code,
  Sparkles,
  ArrowRight,
  Building,
  Megaphone,
  BarChart3,
  Menu,
  X,
} from "lucide-react";

const Button = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const variants = {
    default:
      "text-white hover:from-emerald-600 hover:to-green-700 transform transition-all duration-200 shadow-lg cursor-pointer shadow-emerald-400/15 hover:shadow-emerald-400/25",
    outline:
      "border-2 border-gray-700 text-gray-300 hover:text-white hover:border-emerald-400 hover:bg-emerald-400/10 transform hover:scale-105 transition-all duration-200",
  };
  return (
    <button
      className={`px-6 py-3 rounded-lg font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── HOW IT WORKS — horizontal pipeline ───────────────────────────────────────
const HowItWorksPipeline = () => {
  const steps = [
    {
      icon: Calendar,
      number: "01",
      title: "Plan Your Hackathon",
      desc: "Define your theme, challenges, and goals. We'll guide you with best practices.",
    },
    {
      icon: Megaphone,
      number: "02",
      title: "Attract Participants",
      desc: "Promote your hackathon to students and developers worldwide.",
    },
    {
      icon: Trophy,
      number: "03",
      title: "Manage & Judge",
      desc: "Use our tools to review submissions, evaluate projects, and manage teams.",
    },
    {
      icon: BarChart3,
      number: "04",
      title: "Showcase Results",
      desc: "Highlight winning projects, share outcomes, and boost your brand presence.",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-bold ZaptronFont text-center mb-2 bg-white bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Simple steps to launch your hackathon successfully
        </p>

        {/* Desktop pipeline */}
        <div className="hidden lg:block relative">
          {/* Connector line */}
          <div className="absolute top-[52px] left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-[2px] bg-gradient-to-r from-emerald-400/20 via-emerald-400/60 to-emerald-400/20" />
          {/* Animated dot on line */}
          <div className="absolute top-[46px] left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-[14px] overflow-hidden">
            <div
              className="absolute top-0 h-[2px] w-8 bg-gradient-to-r from-transparent via-emerald-300 to-transparent"
              style={{ animation: "slideAlong 3s linear infinite" }}
            />
          </div>

          <style>{`
            @keyframes slideAlong {
              0% { left: -10%; }
              100% { left: 110%; }
            }
          `}</style>

          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Node */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-gray-900 border-2 border-emerald-400/40 group-hover:border-emerald-400 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-400/30 z-10 relative">
                      <Icon className="w-7 h-7 text-emerald-400" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-400 text-gray-900 text-xs font-bold flex items-center justify-center z-20">
                      {i + 1}
                    </span>
                  </div>

                  {/* Card */}
                  <div className="w-full p-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border border-gray-700 group-hover:border-emerald-400/60 group-hover:shadow-xl group-hover:shadow-emerald-400/10 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="text-xs font-mono text-emerald-400/50 mb-1">
                      {step.number}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical pipeline */}
        <div className="lg:hidden relative pl-8">
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-emerald-400/20 via-emerald-400/60 to-emerald-400/20" />
          <div className="space-y-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative flex gap-6 group">
                  <div className="absolute -left-[26px] w-10 h-10 rounded-full bg-gray-900 border-2 border-emerald-400/50 group-hover:border-emerald-400 flex items-center justify-center transition-all duration-300 shrink-0">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="ml-4 p-5 w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 group-hover:border-emerald-400/60 transition-all duration-300">
                    <div className="text-xs font-mono text-emerald-400/50 mb-1">
                      {step.number}
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-emerald-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const BenefitsWorkflow = () => {
  const benefits = [
    {
      icon: Users,
      title: "Global Reach",
      desc: "Connect with innovators across the globe and attract diverse talent.",
      tag: "AUDIENCE",
      color: "from-blue-500/10 to-blue-600/5",
      border: "border-blue-500/30 group-hover:border-blue-400/60",
      accent: "text-blue-400",
      tagColor: "bg-blue-500/20 text-blue-300",
    },
    {
      icon: Building,
      title: "Seamless Management",
      desc: "Track registrations, teams, and projects with ease on our platform.",
      tag: "OPERATIONS",
      color: "from-violet-500/10 to-violet-600/5",
      border: "border-violet-500/30 group-hover:border-violet-400/60",
      accent: "text-violet-400",
      tagColor: "bg-violet-500/20 text-violet-300",
    },
    {
      icon: Code,
      title: "Technical Support",
      desc: "Get help setting up challenges, judging systems, and integrations.",
      tag: "SUPPORT",
      color: "from-emerald-500/10 to-emerald-600/5",
      border: "border-emerald-500/30 group-hover:border-emerald-400/60",
      accent: "text-emerald-400",
      tagColor: "bg-emerald-500/20 text-emerald-300",
    },
    {
      icon: Target,
      title: "Recognition & Impact",
      desc: "Promote your organization's brand while fostering innovation.",
      tag: "IMPACT",
      color: "from-amber-500/10 to-amber-600/5",
      border: "border-amber-500/30 group-hover:border-amber-400/60",
      accent: "text-amber-400",
      tagColor: "bg-amber-500/20 text-amber-300",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl md:text-6xl ZaptronFont font-bold text-center mb-2 bg-white bg-clip-text text-transparent">
          Why Organize Here?
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Unlock powerful tools to maximize your hackathon's impact
        </p>

        <div className="relative">
          {/* Background track */}
          <div className="hidden lg:block absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 relative z-10">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              const isLast = i === benefits.length - 1;
              return (
                <div
                  key={i}
                  className="relative flex lg:flex-col items-stretch"
                >
                  <div
                    className={`group flex-1 mx-2 p-6 rounded-xl bg-gradient-to-br ${benefit.color} border ${benefit.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-widest mb-4 ${benefit.tagColor}`}
                    >
                      {benefit.tag}
                    </span>

                    <div className="w-12 h-12 rounded-lg bg-gray-900/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-6 h-6 ${benefit.accent}`} />
                    </div>

                    <h3 className="font-semibold text-lg mb-2 group-hover:text-white transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {benefit.desc}
                    </p>

                    {/* Step progress dots */}
                    <div className="mt-4 flex items-center gap-1">
                      {benefits.map((_, j) => (
                        <div
                          key={j}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            j === i
                              ? `flex-1 ${benefit.accent.replace(
                                  "text-",
                                  "bg-"
                                )}`
                              : "w-4 bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {!isLast && (
                    <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-4 h-4 items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function OrganizerHome() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Navbar */}
      <header className="relative z-50 bg-gray-900/90 backdrop-blur-sm border-b border-green-500/30 sticky top-0">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60" />
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10">
              <img
                src="hackSprint.webp"
                className="w-full h-full object-contain"
                alt="HackSprint Logo"
              />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white font-mono tracking-wide">
              HackSprint
            </span>
          </button>

          <div className="flex items-center space-x-4">
            {localStorage.getItem("adminToken") ? (
              <Button
                className="hidden md:inline-flex"
                onClick={() => navigate("/admin")}
              >
                Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                className="hidden md:inline-flex"
                onClick={() => navigate("/adminlogin")}
              >
                Organize Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            <button
              className="md:hidden p-2 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800/50 shadow-lg">
            <div className="p-4">
              {localStorage.getItem("adminToken") ? (
                <Button className="w-full" onClick={() => navigate("/admin")}>
                  Dashboard
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => navigate("/adminlogin")}
                >
                  Organize Now
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="ZaptronFont text-emerald-300 font-medium">
                  Empower Innovation
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl ZaptronFont font-bold mb-2 bg-white bg-clip-text text-transparent">
              Organize Hackathons with Ease
            </h1>
            <p className="md:text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Launch, manage, and scale your hackathons on our platform. Connect
              with innovators, showcase challenges, and drive impactful
              solutions effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works — pipeline */}
      <HowItWorksPipeline />

      {/* Benefits — workflow track */}
      <BenefitsWorkflow />
    </div>
  );
}
