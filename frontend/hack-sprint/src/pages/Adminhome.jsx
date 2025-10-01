import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ChartBar,
  Menu,
  X,
} from "lucide-react";

const Button = ({ children, className = "", variant = "default", ...props }) => {
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

const InteractiveCard = ({ title, desc, icon: Icon, delay = 0 }) => (
  <div
    className="group p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-400/20 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-lg bg-emerald-400/10 mr-4 group-hover:bg-emerald-400/20">
        <Icon className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300" />
      </div>
      <h3 className="font-semibold text-xl group-hover:text-emerald-300 transition-colors duration-300">
        {title}
      </h3>
    </div>
    <p className="text-gray-300 text-md leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
      {desc}
    </p>
    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
      <ArrowRight className="w-5 h-5 text-emerald-400" />
    </div>
  </div>
);

const FAQItem = ({ q, a, delay = 0 }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 hover:border-emerald-400 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        className="w-full flex justify-between items-center font-semibold text-left group"
        onClick={() => setOpen(!open)}
      >
        <span className="group-hover:text-emerald-300 transition-colors duration-200">
          {q}
        </span>
        <div
          className={`p-2 rounded-full bg-emerald-400/10 transition-all duration-300 ${open ? "bg-emerald-400/20 rotate-180" : ""
            }`}
        >
          <ChevronDown className="w-5 h-5 text-emerald-400" />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
      >
        <p className="text-gray-300 leading-relaxed pl-2">{a}</p>
      </div>
    </div>
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
      <header className="relative z-50 border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-lg sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
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

          {/* <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-green-400 font-medium">
              Features
            </a>
            <a href="#process" className="text-gray-300 hover:text-green-400 font-medium">
              Process
            </a>
            <a href="#resources" className="text-gray-300 hover:text-green-400 font-medium">
              Resources
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-green-400 font-medium">
              Stories
            </a>
          </nav> */}

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

            {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-1 py-1 border-gray-800/50 shadow-lg">
            <div className="p-4 space-y-4">
              {localStorage.getItem("adminToken") ? (
                <Button
                  className="w-full"
                  onClick={() => navigate("/admin")}
                >
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

      <section className="relative py-32">
        <div className="container mx-auto px-6 text-center relative z-10">
          <div
            className={`transition-all duration-1000 transform ${isVisible
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

            <h1 className="text-4xl md:text-6xl ZaptronFont font-bold mb-2 bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
              Organize Hackathons with Ease
            </h1>
            <p className="md:text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Launch, manage, and scale your hackathons on our platform. Connect
              with innovators, showcase challenges, and drive impactful
              solutions effortlessly.
            </p>

            {/* <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/create-hackathon">
                <Button className="cursor-pointer">
                  Create Hackathon
                  <ArrowRight className="inline w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div> */}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-6xl mb-1 ZaptronFont font-bold text-center mb-0 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Simple steps to launch your hackathon successfully
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <InteractiveCard
              title="Plan Your Hackathon"
              desc="Define your theme, challenges, and goals. We’ll guide you with best practices."
              icon={Calendar}
              delay={0}
            />
            <InteractiveCard
              title="Attract Participants"
              desc="Promote your hackathon to students and developers worldwide."
              icon={Megaphone}
              delay={100}
            />
            <InteractiveCard
              title="Manage & Judge"
              desc="Use our tools to review submissions, evaluate projects, and manage teams."
              icon={Trophy}
              delay={200}
            />
            <InteractiveCard
              title="Showcase Results"
              desc="Highlight winning projects, share outcomes, and boost your brand presence."
              icon={ChartBar}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl md:text-6xl ZaptronFont mb-1 font-bold text-center mb-0 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
            Why Organize Here?
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Unlock powerful tools to maximize your hackathon’s impact
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <InteractiveCard
              title="Global Reach"
              desc="Connect with innovators across the globe and attract diverse talent."
              icon={Users}
              delay={0}
            />
            <InteractiveCard
              title="Seamless Management"
              desc="Track registrations, teams, and projects with ease on our platform."
              icon={Building}
              delay={100}
            />
            <InteractiveCard
              title="Technical Support"
              desc="Get help setting up challenges, judging systems, and integrations."
              icon={Code}
              delay={200}
            />
            <InteractiveCard
              title="Recognition & Impact"
              desc="Promote your organization’s brand while fostering innovation."
              icon={Target}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-5xl md:text-6xl ZaptronFont mb-1 font-bold text-center mb-0 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Answers for organizers about hosting hackathons
          </p>
          <div className="space-y-6">
            {[
              {
                q: "Who can organize a hackathon?",
                a: "Universities, companies, startups, and communities can all host hackathons on our platform.",
              },
              {
                q: "Do you provide participant outreach?",
                a: "Yes! We promote your hackathon to our student and developer network to ensure great turnout.",
              },
              {
                q: "Is there a cost to host?",
                a: "We offer both free and premium hosting options depending on your requirements.",
              },
              {
                q: "Can I customize judging criteria?",
                a: "Absolutely. You can define custom judging rubrics and invite external judges.",
              },
            ].map((faq, i) => (
              <FAQItem key={i} {...faq} delay={i * 100} className="" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
