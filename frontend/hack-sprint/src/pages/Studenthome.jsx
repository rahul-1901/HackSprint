import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Trophy,
  Github,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Code,
  Target,
  Clock,
  CheckCircle2,
  Zap,
  Brain,
  MessageSquare,
  BarChart3,
} from "lucide-react";

const Button = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  const variants = {
    default:
      "bg-gradient-to-r from-emerald-600 to-green-700 text-gray-900 hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-emerald-400/25",
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

const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

// ─── HOW IT WORKS — horizontal pipeline ───────────────────────────────────────
const HowItWorksPipeline = () => {
  const steps = [
    {
      icon: Calendar,
      number: "01",
      title: "Find Hackathons",
      desc: "Explore upcoming hackathons that match your interests and skill level.",
    },
    {
      icon: Users,
      number: "02",
      title: "Join or Form a Team",
      desc: "Work alone or team up with friends or other participants to tackle challenges.",
    },
    {
      icon: Github,
      number: "03",
      title: "Build & Submit",
      desc: "Develop your project during the event and submit it before the deadline.",
    },
    {
      icon: Trophy,
      number: "04",
      title: "Learn & Improve",
      desc: "Gain practical experience, learn new technologies, and grow your skills.",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl md:text-6xl font-bold ZaptronFont text-center mb-2 bg-white bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Follow these simple steps to start your hackathon journey
        </p>

        {/* Desktop pipeline */}
        <div className="hidden lg:block relative">
          {/* Connector line */}
          <div className="absolute top-[52px] left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-[2px] bg-gradient-to-r from-emerald-400/20 via-emerald-400/60 to-emerald-400/20" />
          {/* Animated dots on line */}
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
                <div key={i} className="flex flex-col items-center text-center group">
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
                    <div className="text-xs font-mono text-emerald-400/50 mb-1">{step.number}</div>
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
                  {/* Node on line */}
                  <div className="absolute -left-[26px] w-10 h-10 rounded-full bg-gray-900 border-2 border-emerald-400/50 group-hover:border-emerald-400 flex items-center justify-center transition-all duration-300 shrink-0">
                    <Icon className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="ml-4 p-5 w-full bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 group-hover:border-emerald-400/60 transition-all duration-300">
                    <div className="text-xs font-mono text-emerald-400/50 mb-1">{step.number}</div>
                    <h3 className="font-semibold mb-1 group-hover:text-emerald-300 transition-colors">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
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

// ─── SKILLS — workflow track ───────────────────────────────────────────────────
const SkillsWorkflow = () => {
  const skills = [
    {
      icon: Target,
      title: "Problem Solving",
      desc: "Analyze complex challenges and develop innovative, effective solutions.",
      tag: "FOUNDATION",
      color: "from-blue-500/10 to-blue-600/5",
      border: "border-blue-500/30 group-hover:border-blue-400/60",
      accent: "text-blue-400",
      tagColor: "bg-blue-500/20 text-blue-300",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      desc: "Master working with diverse teams, communication, and project coordination.",
      tag: "TEAMWORK",
      color: "from-violet-500/10 to-violet-600/5",
      border: "border-violet-500/30 group-hover:border-violet-400/60",
      accent: "text-violet-400",
      tagColor: "bg-violet-500/20 text-violet-300",
    },
    {
      icon: Github,
      title: "Coding & Development",
      desc: "Enhance programming skills with real-world projects using cutting-edge technologies.",
      tag: "TECHNICAL",
      color: "from-emerald-500/10 to-emerald-600/5",
      border: "border-emerald-500/30 group-hover:border-emerald-400/60",
      accent: "text-emerald-400",
      tagColor: "bg-emerald-500/20 text-emerald-300",
    },
    {
      icon: Clock,
      title: "Project Management",
      desc: "Plan, organize, and execute complex projects within tight deadlines and constraints.",
      tag: "EXECUTION",
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
          Skills You'll Gain
        </h2>
        <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
          Develop essential skills that will accelerate your career in tech
        </p>

        {/* Workflow track */}
        <div className="relative">
          {/* Background track */}
          <div className="hidden lg:block absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 relative z-10">
            {skills.map((skill, i) => {
              const Icon = skill.icon;
              const isLast = i === skills.length - 1;
              return (
                <div key={i} className="relative flex lg:flex-col items-stretch">
                  {/* Card */}
                  <div
                    className={`group flex-1 mx-2 p-6 rounded-xl bg-gradient-to-br ${skill.color} border ${skill.border} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    {/* Stage tag */}
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-widest mb-4 ${skill.tagColor}`}>
                      {skill.tag}
                    </span>

                    <div className={`w-12 h-12 rounded-lg bg-gray-900/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${skill.accent}`} />
                    </div>

                    <h3 className="font-semibold text-lg mb-2 group-hover:text-white transition-colors duration-300">
                      {skill.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                      {skill.desc}
                    </p>

                    {/* Step indicator */}
                    <div className="mt-4 flex items-center gap-1">
                      {skills.map((_, j) => (
                        <div
                          key={j}
                          className={`h-1 rounded-full transition-all duration-300 ${
                            j === i
                              ? `flex-1 ${skill.accent.replace("text-", "bg-")}`
                              : "w-4 bg-gray-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Arrow connector between cards (desktop) */}
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

// ─── FAQ — formal accordion ────────────────────────────────────────────────────
const FAQItem = ({ q, a, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-b border-gray-700/60 last:border-b-0 transition-colors duration-200 ${open ? "bg-emerald-400/[0.03]" : ""}`}>
      <button
        className="w-full flex justify-between items-center py-6 px-2 text-left group"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-emerald-400/40 w-5 shrink-0">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="font-medium text-gray-100 group-hover:text-white transition-colors duration-200 pr-4">
            {q}
          </span>
        </div>
        <div className={`shrink-0 w-8 h-8 rounded-full border border-gray-600 group-hover:border-emerald-400/50 flex items-center justify-center transition-all duration-300 ${open ? "border-emerald-400/50 bg-emerald-400/10 rotate-180" : ""}`}>
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors duration-200" />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="pl-9 pr-12 pb-6 text-gray-400 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
};

// ─── MAIN EXPORT ───────────────────────────────────────────────────────────────
export default function StudentHome() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const faqs = [
    {
      q: "Who can participate in hackathons?",
      a: "Students and professionals from any background are welcome. Whether you're a beginner or experienced developer, there's a place for you.",
    },
    {
      q: "Do I need to have a team?",
      a: "You can participate solo or form a team with friends or other participants. Many hackathons also have team formation sessions to help you find teammates.",
    },
    {
      q: "Is there a registration fee?",
      a: "No, all hackathons on our platform are completely free to join. We believe in making innovation accessible to everyone.",
    },
    {
      q: "How do I submit my project?",
      a: "Submit your project through the provided portal before the deadline. Make sure to include your code, demo, and presentation materials.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div
            className={`transition-all duration-1000 transform ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-medium ZaptronFont">
                  Join the Innovation
                </span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-2 ZaptronFont bg-white bg-clip-text text-transparent">
              Hackathons for Students & Innovators
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join hackathons, learn new skills, collaborate with peers, and
              bring your ideas to life. Build real projects, gain mentorship,
              and enhance your portfolio with hands-on experience.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/hackathons">
                <Button className="cursor-pointer">
                  Browse Hackathons
                  <ArrowRight className="inline w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works — pipeline */}
      <HowItWorksPipeline />

      {/* Skills — workflow */}
      <SkillsWorkflow />

      {/* FAQ — formal */}
      {/* <section className="py-24">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-5xl md:text-6xl ZaptronFont font-bold text-center mb-2 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Everything you need to know about participating in hackathons
          </p>

          <div className="bg-gradient-to-b from-gray-800/60 to-gray-900/60 rounded-2xl border border-gray-700 overflow-hidden divide-y divide-gray-700/60 px-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} {...faq} index={i} />
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}