import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Code,
  Zap,
  Target,
  Gift,
  Star,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  Menu,
  X,
  CheckCircle,
  Rocket,
  Lightbulb,
  Terminal,
  Play,
  Sparkles
} from "lucide-react";

// Custom Badge Component
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}>
    {children}
  </span>
);

// Custom Button Component
const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background transform hover:scale-105";
  
  const variants = {
    default: "bg-green-400 text-gray-900 hover:bg-green-500 shadow-lg hover:shadow-green-400/25",
    outline: "border border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800/50 hover:border-green-400/50 text-gray-300 hover:text-white",
  };
  
  const sizes = {
    default: "h-10 py-2 px-4",
    lg: "h-12 px-8 text-lg",
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Card Components
const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-gray-800/50 bg-gray-900/70 backdrop-blur-sm shadow-2xl hover:border-green-400/30 hover:shadow-green-400/10 transition-all duration-500 transform hover:scale-105 ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight text-white ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-400 mt-2 leading-relaxed ${className}`}>{children}</p>
);

// Floating Particles Component
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-green-400 rounded-full opacity-40 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${2 + Math.random() * 4}s`,
        }}
      />
    ))}
    {[...Array(20)].map((_, i) => (
      <div
        key={`large-${i}`}
        className="absolute w-2 h-2 bg-green-600 rounded-full opacity-20"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationName: "float",
          animationDuration: "6s",
          animationTimingFunction: "ease-in-out",
          animationIterationCount: "infinite",
        }}
      />
    ))}
  </div>
);

// Grid Background Component
const GridBackground = () => (
  <div className="absolute inset-0 opacity-5">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
        linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
      `,
        backgroundSize: "40px 40px",
      }}
    />
    <div
      className="absolute top-1/3 left-1/4 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"
      style={{
        animationName: "morph",
        animationDuration: "8s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
      }}
    />
    <div
      className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-green-600/3 rounded-full blur-3xl"
      style={{
        animationDelay: "4s",
        animationName: "morph",
        animationDuration: "8s",
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
      }}
    />
  </div>
);

export default function HackathonHomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      <GridBackground />
      <FloatingParticles />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-green-400/10 text-green-400 border border-green-400/20 hover:bg-green-400/20 transition-all duration-300">
              <Clock className="w-3 h-3 mr-2" />
              March 15-17, 2025 • 48 Hours of Innovation
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-bold text-center relative leading-tight">
              Code the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Future</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 blur-3xl opacity-10 -z-10" />
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed">
              Join 500+ developers, designers, and innovators for the ultimate hackathon experience. Build
              groundbreaking solutions, learn from industry experts, and compete for $50,000+ in prizes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <Button size="lg" className="text-lg px-8 glow-effect">
                Register for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Play className="mr-2 h-5 w-5" />
                View Schedule
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900/30 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-px h-8 bg-green-400"></div>
              <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">
                ABOUT THE EVENT
              </span>
              <div className="w-px h-8 bg-green-400"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white leading-tight">What is HackFest 2025?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              The premier hackathon bringing together the brightest minds to solve real-world challenges using
              cutting-edge technology, AI, and innovative thinking.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Innovation Focus",
                desc: "Build solutions for AI, Web3, Climate Tech, HealthTech, and FinTech challenges",
                badge: "Hot"
              },
              {
                icon: Target,
                title: "Real Impact",
                desc: "Work on projects that address genuine problems with potential for real-world implementation",
                badge: "Featured"
              },
              {
                icon: Users,
                title: "Expert Mentorship",
                desc: "Get guidance from industry leaders, VCs, and technical experts throughout the event",
                badge: "Premium"
              }
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-400/10 rounded-xl flex items-center justify-center border border-green-400/20">
                      <feature.icon className="h-6 w-6 text-green-400" />
                    </div>
                    <Badge className="bg-green-400/20 text-green-400 border border-green-400/20 text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-px h-8 bg-green-400"></div>
              <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">
                EVENT TIMELINE
              </span>
              <div className="w-px h-8 bg-green-400"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Event Schedule</h2>
            <p className="text-xl text-gray-400">48 hours packed with coding, learning, and networking</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Day 1 */}
            <Card className="border-green-400/20 bg-gradient-to-br from-green-400/5 to-gray-900/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  Day 1 - Friday, March 15
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { time: "6:00 PM", event: "Registration & Check-in" },
                  { time: "7:00 PM", event: "Opening Ceremony" },
                  { time: "8:00 PM", event: "Team Formation" },
                  { time: "9:00 PM", event: "Hacking Begins!" },
                  { time: "11:00 PM", event: "Late Night Snacks" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="font-medium text-green-400">{item.time}</span>
                    <span className="text-sm text-gray-300">{item.event}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Day 2 */}
            <Card className="border-green-400/20 bg-gradient-to-br from-green-400/5 to-gray-900/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  Day 2 - Saturday, March 16
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { time: "8:00 AM", event: "Breakfast & Coffee" },
                  { time: "10:00 AM", event: "Tech Workshops" },
                  { time: "12:00 PM", event: "Lunch & Networking" },
                  { time: "2:00 PM", event: "Mentor Sessions" },
                  { time: "6:00 PM", event: "Dinner & Entertainment" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="font-medium text-green-400">{item.time}</span>
                    <span className="text-sm text-gray-300">{item.event}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Day 3 */}
            <Card className="border-green-400/20 bg-gradient-to-br from-green-400/5 to-gray-900/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-400" />
                  Day 3 - Sunday, March 17
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { time: "8:00 AM", event: "Final Breakfast" },
                  { time: "9:00 AM", event: "Submission Deadline" },
                  { time: "10:00 AM", event: "Project Demos" },
                  { time: "2:00 PM", event: "Judging & Deliberation" },
                  { time: "4:00 PM", event: "Awards Ceremony" }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <span className="font-medium text-green-400">{item.time}</span>
                    <span className="text-sm text-gray-300">{item.event}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="py-20 bg-gray-900/30 backdrop-blur-sm relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-px h-8 bg-green-400"></div>
              <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">
                REWARDS & RECOGNITION
              </span>
              <div className="w-px h-8 bg-green-400"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Amazing Prizes</h2>
            <p className="text-xl text-gray-400">Over $50,000 in prizes and opportunities</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "1st Place",
                amount: "$20,000",
                icon: Trophy,
                badge: "GRAND PRIZE",
                features: ["Cash prize", "Mentorship program", "Startup incubator access", "Tech company interviews"],
                gradient: "from-green-400/10 to-green-600/5"
              },
              {
                title: "2nd Place",
                amount: "$10,000",
                icon: Star,
                badge: "RUNNER UP",
                features: ["Cash prize", "Tech equipment", "Mentorship sessions", "Conference tickets"],
                gradient: "from-gray-800/50 to-gray-900/70"
              },
              {
                title: "3rd Place",
                amount: "$5,000",
                icon: Gift,
                badge: "THIRD PLACE",
                features: ["Cash prize", "Premium software licenses", "Online course access", "Networking opportunities"],
                gradient: "from-gray-800/50 to-gray-900/70"
              },
              {
                title: "Special Categories",
                amount: "$15,000+",
                icon: Target,
                badge: "CATEGORIES",
                features: ["Best AI Innovation", "Most Social Impact", "Best Design", "People's Choice"],
                gradient: "from-gray-800/50 to-gray-900/70"
              }
            ].map((prize, index) => (
              <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${prize.gradient} ${index === 0 ? 'ring-2 ring-green-400/20' : ''}`}>
                {index === 0 && (
                  <div className="absolute top-0 right-0 bg-green-400 text-gray-900 px-3 py-1 text-xs font-bold rounded-bl-lg">
                    {prize.badge}
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-green-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-400/20">
                    <prize.icon className="w-8 h-8 text-green-400" />
                  </div>
                  <CardTitle className="text-2xl">{prize.title}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-green-400 mt-2">{prize.amount}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    {prize.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-gray-400">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-px h-8 bg-green-400"></div>
              <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">
                INNOVATION TRACKS
              </span>
              <div className="w-px h-8 bg-green-400"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Challenge Tracks</h2>
            <p className="text-xl text-gray-400">Choose your focus area and build something amazing</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI & Machine Learning",
                desc: "Build intelligent applications using cutting-edge AI technologies",
                icon: "🤖",
                color: "green"
              },
              {
                title: "Web3 & Blockchain",
                desc: "Create decentralized applications and blockchain solutions",
                icon: "⛓️",
                color: "blue"
              },
              {
                title: "Climate Tech",
                desc: "Develop solutions for environmental challenges and sustainability",
                icon: "🌱",
                color: "emerald"
              },
              { 
                title: "HealthTech", 
                desc: "Innovate in healthcare, wellness, and medical technology", 
                icon: "🏥",
                color: "red"
              },
              { 
                title: "FinTech", 
                desc: "Build the future of finance and digital payments", 
                icon: "💰",
                color: "yellow"
              },
              { 
                title: "Open Innovation", 
                desc: "Create anything that solves real-world problems", 
                icon: "🚀",
                color: "purple"
              },
            ].map((track, index) => (
              <Card key={index} className="group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">
                      {track.icon}
                    </div>
                    <Sparkles className="w-4 h-4 text-green-400/50 group-hover:text-green-400 transition-colors" />
                  </div>
                  <CardTitle className="group-hover:text-green-400 transition-colors">{track.title}</CardTitle>
                  <CardDescription>{track.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration CTA */}
      <section className="py-20 bg-gray-900/50 backdrop-blur-sm border-y border-gray-800/50 relative">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Join HackFest 2025?</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Registration is free and includes meals, swag, workshops, and access to all events. Limited spots available!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button size="lg" className="text-lg px-8 glow-effect">
                Register Now - It's Free!
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Github className="mr-2 h-5 w-5" />
                Join Discord Community
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              {[
                "Free to join",
                "No credit card required", 
                "Limited spots available"
              ].map((feature, index) => (
                <span key={index} className="flex items-center gap-2 bg-gray-800/30 px-4 py-2 rounded-full">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  {feature}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">Registration closes March 10th or when we reach capacity</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-px h-8 bg-green-400"></div>
              <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">
                FREQUENTLY ASKED
              </span>
              <div className="w-px h-8 bg-green-400"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Got Questions?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                q: "Who can participate?",
                a: "Anyone! Students, professionals, designers, and entrepreneurs are all welcome. No experience required.",
              },
              {
                q: "Do I need a team?",
                a: "No! You can participate solo or we'll help you find teammates during the team formation session.",
              },
              {
                q: "What should I bring?",
                a: "Just bring your laptop, charger, and enthusiasm! We'll provide everything else including meals and swag.",
              },
              {
                q: "Is there a cost to participate?",
                a: "Nope! HackFest 2025 is completely free including meals, workshops, and all activities.",
              },
              {
                q: "What if I'm a beginner?",
                a: "Perfect! We have workshops, mentors, and resources specifically designed to help beginners succeed.",
              },
              {
                q: "Can I work on an existing project?",
                a: "All projects must be started from scratch during the hackathon to ensure fairness for all participants.",
              },
            ].map((faq, index) => (
              <Card key={index} className="group">
                <CardHeader>
                  <CardTitle className="text-lg text-white group-hover:text-green-400 transition-colors duration-300 flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 font-bold text-sm">?</span>
                    </div>
                    {faq.q}
                  </CardTitle>
                  <CardDescription className="text-gray-400 leading-relaxed ml-9">{faq.a}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes morph {
          0%, 100% {
            border-radius: 50%;
            transform: scale(1);
          }
          25% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: scale(1.1);
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: scale(0.9);
          }
          75% {
            border-radius: 40% 30% 60% 70% / 40% 50% 60% 80%;
            transform: scale(1.05);
          }
        }

        .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
          }
          100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4);
          }
        }

        .ZaptronFont {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}