import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import { Calendar, Users, Trophy, Github, ArrowRight, ChevronDown, Sparkles, Code, Target, Clock } from "lucide-react";

const Button = ({ children, className = "", variant = "default", ...props }) => {
  const variants = {
    default:
      "bg-gradient-to-r from-emerald-600 to-green-700 text-gray-900 hover:from-emerald-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-emerald-400/25",
    outline:
      "border-2 border-gray-700 text-gray-300 hover:text-white hover:border-emerald-400 hover:bg-emerald-400/10 transform hover:scale-105 transition-all duration-200",
  };
  return (
    <button className={`px-6 py-3 rounded-lg font-medium ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const InteractiveCard = ({ title, desc, icon: Icon, className = "", delay = 0, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    onClick?.();
  };

  return (
    <div
      className={`group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-400/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer ${isClicked ? "scale-95" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg bg-emerald-400/10 mr-4 transition-all duration-300 ${isHovered ? "bg-emerald-400/20 scale-110" : ""}`}>
          <Icon className={`w-8 h-8 text-emerald-400 transition-all duration-300 ${isHovered ? "text-emerald-300 scale-110" : ""}`} />
        </div>
        <h3 className="font-semibold text-xl group-hover:text-emerald-300 transition-colors duration-300">{title}</h3>
      </div>
      <p className="text-gray-300 text-md leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{desc}</p>
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <ArrowRight className="w-5 h-5 text-emerald-400" />
      </div>
    </div>
  );
};

const HackathonCard = ({ title, date, desc, status = "upcoming", participants = 0, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    upcoming: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    completed: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  };

  return (
    <div
      className={`group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-400/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Calendar className="w-6 h-6 text-emerald-400 mr-3" />
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        {participants > 0 && (
          <div className="flex items-center text-gray-400 text-sm">
            <Users className="w-4 h-4 mr-1" />
            {participants}
          </div>
        )}
      </div>

      <h3 className="font-semibold text-xl mb-2 group-hover:text-emerald-300 transition-colors duration-300">{title}</h3>
      <p className="text-emerald-400 font-medium mb-3">{date}</p>
      <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">{desc}</p>

      <div className="mt-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <Button variant="outline" className="text-sm py-2 px-4 bg-transparent">
          Learn More
        </Button>
        <ArrowRight className="w-5 h-5 text-emerald-400" />
      </div>
    </div>
  );
};

const FAQItem = ({ q, a, delay = 0 }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-emerald-400 transition-all duration-300`} style={{ animationDelay: `${delay}ms` }}>
      <button
        className="w-full flex justify-between items-center font-semibold text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="group-hover:text-emerald-300 transition-colors duration-200">{q}</span>
        <div className={`p-2 rounded-full bg-emerald-400/10 transition-all duration-300 ${open ? "bg-emerald-400/20 rotate-180" : ""}`}>
          <ChevronDown className="w-5 h-5 text-emerald-400" />
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
        <p className="text-gray-300 leading-relaxed pl-2">{a}</p>
      </div>
    </div>
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

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export default function StudentHome() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className={`transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-medium ZaptronFont">Join the Innovation</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-2 ZaptronFont bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
              Hackathons for Students & Innovators
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Join hackathons, learn new skills, collaborate with peers, and bring your ideas to life. Build real projects, gain mentorship, and enhance your portfolio with hands-on experience.
            </p>

            {/* <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400"><AnimatedCounter end={500} suffix="+" /></div>
                <div className="text-sm text-gray-400">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400"><AnimatedCounter end={50} suffix="+" /></div>
                <div className="text-sm text-gray-400">Hackathons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400"><AnimatedCounter end={100} suffix="+" /></div>
                <div className="text-sm text-gray-400">Projects</div>
              </div>
            </div> */}

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/hackathons">
                <Button className="cursor-pointer">
                  Browse Hackathons
                  <ArrowRight className="inline w-4 h-4 ml-2" />
                </Button>
              </Link>
              {/* <Button variant="outline" size="lg">
                <Code className="w-4 h-4 mr-2" />
                View Projects
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-6xl font-bold ZaptronFont text-center mb-0 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Follow these simple steps to start your hackathon journey
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <InteractiveCard
              title="Find Hackathons"
              desc="Explore upcoming hackathons that match your interests and skill level."
              icon={Calendar}
              delay={0}
            />
            <InteractiveCard
              title="Join or Form a Team"
              desc="Work alone or team up with friends or other participants to tackle challenges."
              icon={Users}
              delay={100}
            />
            <InteractiveCard
              title="Build & Submit"
              desc="Develop your project during the event and submit it for judging before the deadline."
              icon={Github}
              delay={200}
            />
            <InteractiveCard
              title="Learn & Improve"
              desc="Gain practical experience, learn new technologies, and improve your skills."
              icon={Trophy}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* <section className="py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
            Upcoming Hackathons
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Join these exciting upcoming events and showcase your skills
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <HackathonCard
              title="AI & Machine Learning Challenge"
              date="Oct 10-12, 2025"
              desc="Solve real-world problems using AI and ML technologies. Build intelligent solutions that make a difference."
              status="upcoming"
              participants={127}
              delay={0}
            />
            <HackathonCard
              title="Web Development Sprint"
              date="Nov 5-7, 2025"
              desc="Build full-stack web applications in 48 hours. From concept to deployment in one weekend."
              status="active"
              participants={89}
              delay={100}
            />
            <HackathonCard
              title="HealthTech Innovation"
              date="Dec 1-3, 2025"
              desc="Create projects that improve healthcare solutions and make medical care more accessible."
              status="upcoming"
              participants={156}
              delay={200}
            />
          </div>
        </div>
      </section> */}

      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-6xl ZaptronFont font-bold text-center mb-0 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
            Skills You'll Gain
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Develop essential skills that will accelerate your career in tech
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <InteractiveCard
              title="Problem Solving"
              desc="Learn how to analyze complex challenges and develop innovative, effective solutions."
              icon={Target}
              delay={0}
            />
            <InteractiveCard
              title="Team Collaboration"
              desc="Master the art of working with diverse teams, effective communication, and project coordination."
              icon={Users}
              delay={100}
            />
            <InteractiveCard
              title="Coding & Development"
              desc="Enhance your programming skills with real-world projects using cutting-edge technologies."
              icon={Github}
              delay={200}
            />
            <InteractiveCard
              title="Project Management"
              desc="Learn to plan, organize, and execute complex projects within tight deadlines and constraints."
              icon={Clock}
              delay={300}
            />
          </div>
        </div>
      </section>

      <section className="py-20 ">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-5xl md:text-6xl ZaptronFont font-bold text-center mb-0 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Everything you need to know about participating in hackathons
          </p>
          <div className="space-y-6">
            {[
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
              }
            ].map((faq, i) => (
              <FAQItem key={i} {...faq} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
