import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  Code,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Star,
  CheckCircle,
  Zap,
  Target,
  Rocket,
  Menu,
  X,
  Sparkles,
  Globe,
  BarChart3,
  Play,
  Terminal,
  Lightbulb
} from "lucide-react";

// Custom Button Component
const Button = ({ children, className = "", variant = "default", size = "default", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:scale-105";

  const variants = {
    default: "bg-green-400 text-gray-900 hover:bg-green-500 shadow-lg hover:shadow-green-400/25 glow-effect",
    outline: "border-2 border-green-400/30 text-green-400 hover:bg-green-400/10 hover:border-green-400 backdrop-blur-sm",
    ghost: "text-gray-300 hover:text-green-400 hover:bg-green-400/10"
  };

  const sizes = {
    default: "px-6 py-2.5 text-sm",
    lg: "px-8 py-4 text-lg",
    sm: "px-4 py-2 text-sm"
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
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 transition-all duration-500 hover:shadow-green-400/10 hover:border-green-400/30 hover:scale-105 ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "", ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "", ...props }) => (
  <h3 className={`text-xl font-bold text-white ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "", ...props }) => (
  <p className={`text-gray-400 mt-2 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

// Custom Badge Component
const Badge = ({ children, className = "", ...props }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-400/10 text-green-400 border border-green-400/20 ${className}`} {...props}>
    {children}
  </span>
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
  </div>
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
    {[...Array(10)].map((_, i) => (
      <div
        key={`glow-${i}`}
        className="absolute rounded-full bg-green-500/5 blur-2xl animate-pulse"
        style={{
          width: `${60 + Math.random() * 80}px`,
          height: `${60 + Math.random() * 80}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

export default function HackathonHomepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <GridBackground />
      <FloatingParticles />

      {/* Header */}
      <header className="relative z-50 border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-lg sticky top-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10">
              <img src='hackSprint.webp' className="w-full h-full object-contain" alt="HackSprint Logo" />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white font-mono tracking-wide">
              HackSprint
            </span>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-green-400 transition-colors font-medium">
              Features
            </a>
            <a href="#process" className="text-gray-300 hover:text-green-400 transition-colors font-medium">
              Process
            </a>
            <a href="#resources" className="text-gray-300 hover:text-green-400 transition-colors font-medium">
              Resources
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-green-400 transition-colors font-medium">
              Stories
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Button className="hidden md:inline-flex hover: pointer" onClick={() => navigate('/adminlogin')}>
              Login to Organize
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800/50 shadow-lg">
            <div className="p-4 space-y-4">
              <a href="#features" className="block text-gray-300 hover:text-green-400 transition-colors">Features</a>
              <a href="#process" className="block text-gray-300 hover:text-green-400 transition-colors">Process</a>
              <a href="#resources" className="block text-gray-300 hover:text-green-400 transition-colors">Resources</a>
              <a href="#testimonials" className="block text-gray-300 hover:text-green-400 transition-colors">Stories</a>
              <Button className="w-full">Login to Organize</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="container mx-auto relative z-10">
          {/* <FloatingElement> */}
          <Badge className="mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Empowering Innovation Through Hackathons
          </Badge>
          {/* </FloatingElement> */}

          {/* <FloatingElement delay={200}> */}
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Organize{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              World-Class
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
              Hackathons
            </span>
          </h1>
          {/* </FloatingElement> */}

          {/* <FloatingElement delay={400}> */}
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your vision into reality with our comprehensive platform for hackathon organizers. From planning
            to execution, we provide everything you need to create unforgettable innovation experiences.
          </p>
          {/* </FloatingElement> */}

          {/* <FloatingElement delay={600}> */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button size="lg" className="text-xl px-10 py-5 shadow-2xl">
              Start Organizing Today
              <Rocket className="w-6 h-6 ml-3" />
            </Button>
            <Button size="lg" variant="outline" className="text-xl px-10 py-5">
              <Play className="w-6 h-6 mr-3" />
              View Demo
            </Button>
          </div>
          {/* </FloatingElement> */}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { number: "500+", label: "Successful Hackathons", icon: Trophy },
              { number: "50K+", label: "Participants Engaged", icon: Users },
              { number: "98%", label: "Organizer Satisfaction", icon: Star }
            ].map((stat, index) => (
              // <FloatingElement key={index} delay={800 + index * 200}>
              <Card className="text-center p-8 bg-gradient-to-br from-gray-900/70 to-green-900/10 border-green-400/20">
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <div className="text-4xl font-black text-transparent bg-gradient-to-r from-green-400 to-green-600 bg-clip-text">
                  {stat.number}
                </div>
                <div className="text-gray-400 mt-2 font-medium">{stat.label}</div>
              </Card>
              // </FloatingElement>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-4 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-px h-8 bg-green-400"></div>
              <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">
                COMPREHENSIVE TOOLS
              </span>
              <div className="w-px h-8 bg-green-400"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Succeed
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Our platform provides comprehensive tools and resources to make your hackathon organization seamless and
              impactful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Event Planning",
                description: "Comprehensive planning tools with timeline management, venue coordination, and resource allocation.",
                features: ["Timeline Templates", "Venue Management", "Budget Tracking"],
                gradient: "from-green-500/10 to-green-600/5"
              },
              {
                icon: Users,
                title: "Participant Management",
                description: "Advanced registration system with team formation, skill matching, and communication tools.",
                features: ["Registration Portal", "Team Formation", "Skill Matching"],
                gradient: "from-green-400/10 to-green-500/5"
              },
              {
                icon: Trophy,
                title: "Judging & Awards",
                description: "Streamlined judging process with scoring systems, feedback collection, and award ceremonies.",
                features: ["Digital Scorecards", "Judge Portal", "Award Management"],
                gradient: "from-green-600/10 to-green-700/5"
              },
              {
                icon: BarChart3,
                title: "Real-time Analytics",
                description: "Live dashboards with participant engagement, project submissions, and event metrics.",
                features: ["Live Dashboards", "Engagement Metrics", "Export Reports"],
                gradient: "from-green-500/10 to-green-600/5"
              },
              {
                icon: Target,
                title: "Sponsor Integration",
                description: "Seamless sponsor management with branding opportunities and engagement tracking.",
                features: ["Sponsor Portals", "Branding Tools", "ROI Tracking"],
                gradient: "from-green-400/10 to-green-500/5"
              },
              {
                icon: MapPin,
                title: "Multi-format Support",
                description: "Support for in-person, virtual, and hybrid hackathons with specialized tools for each format.",
                features: ["Virtual Platforms", "Hybrid Events", "In-person Tools"],
                gradient: "from-green-600/10 to-green-700/5"
              }
            ].map((feature, index) => (
              <Card key={index} className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-gradient-to-br ${feature.gradient}`}>
                <CardHeader>
                  <div className={`w-16 h-16 bg-green-400/10 border border-green-400/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-green-400" />
                  </div>
                  <CardTitle className="text-2xl mb-3 group-hover:text-green-400 transition-colors duration-300">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-px h-8 bg-green-400"></div>
              <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">
                PROVEN METHODOLOGY
              </span>
              <div className="w-px h-8 bg-green-400"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Journey to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Success
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Follow our proven 4-step process to organize hackathons that inspire innovation and create lasting impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Plan & Setup",
                description: "Define your hackathon goals, timeline, and requirements using our planning templates.",
                icon: Terminal
              },
              {
                step: "2",
                title: "Promote & Register",
                description: "Launch your registration portal and promote your event to attract the right participants.",
                icon: Globe
              },
              {
                step: "3",
                title: "Execute & Monitor",
                description: "Run your hackathon with real-time monitoring, participant support, and seamless coordination.",
                icon: Zap
              },
              {
                step: "4",
                title: "Judge & Celebrate",
                description: "Facilitate judging, announce winners, and celebrate the innovative solutions created.",
                icon: Trophy
              }
            ].map((process, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 bg-green-400/10 border-2 border-green-400/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 group-hover:bg-green-400/20 group-hover:border-green-400/40 transition-all duration-300`}>
                  <span className="text-3xl font-black text-green-400">{process.step}</span>
                </div>
                <div className="mb-4">
                  <process.icon className="w-8 h-8 text-green-400/60 mx-auto mb-2" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-green-400 transition-colors duration-300">{process.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="relative py-20 px-4 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-px h-8 bg-green-400"></div>
              <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">
                KNOWLEDGE BASE
              </span>
              <div className="w-px h-8 bg-green-400"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Resources
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Access our extensive library of guides, templates, and best practices to ensure your hackathon's success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-gray-900/70 to-green-900/10 border-green-400/20">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="flex items-center text-2xl">
                  <Clock className="w-7 h-7 text-green-400 mr-3" />
                  Planning Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4">
                  {[
                    {
                      title: "Timeline Templates",
                      description: "Pre-built schedules for 24h, 48h, and weekend hackathons"
                    },
                    {
                      title: "Budget Calculators",
                      description: "Estimate costs for venues, catering, prizes, and more"
                    },
                    {
                      title: "Venue Checklists",
                      description: "Essential requirements for physical and virtual spaces"
                    }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3 mt-1" />
                      <div>
                        <div className="font-bold text-white text-lg">{item.title}</div>
                        <div className="text-gray-400 mt-1">{item.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-gray-900/70 to-green-900/10 border-green-400/20">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="flex items-center text-2xl">
                  <Lightbulb className="w-7 h-7 text-green-400 mr-3" />
                  Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="space-y-4">
                  {[
                    {
                      title: "Engagement Strategies",
                      description: "Keep participants motivated throughout the event"
                    },
                    {
                      title: "Judging Frameworks",
                      description: "Fair and transparent evaluation criteria"
                    },
                    {
                      title: "Sponsor Relations",
                      description: "Build lasting partnerships with industry leaders"
                    }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-green-400 mr-3 mt-1" />
                      <div>
                        <div className="font-bold text-white text-lg">{item.title}</div>
                        <div className="text-gray-400 mt-1">{item.description}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <div className="w-px h-8 bg-green-400"></div>
              <span className="text-green-400 text-sm font-semibold tracking-wide uppercase mx-4">
                CLIENT STORIES
              </span>
              <div className="w-px h-8 bg-green-400"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Success{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
                Stories
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Hear from organizers who have created impactful hackathons using our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Tech Lead, InnovateCorp",
                initials: "SC",
                quote: "HackForge transformed our annual hackathon from a logistical nightmare into a seamless experience. The participant engagement increased by 300%!",
              },
              {
                name: "Marcus Rodriguez",
                role: "Event Director, StartupWeek",
                initials: "MR",
                quote: "The real-time analytics and sponsor integration features helped us secure 40% more funding and deliver measurable ROI to our partners.",
              },
              {
                name: "Aisha Patel",
                role: "Community Manager, DevHub",
                initials: "AP",
                quote: "From 50 to 500 participants in just one year! The platform's scalability and comprehensive tools made our growth possible.",
              }
            ].map((testimonial, index) => (
              <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
                <CardContent className="p-0">
                  <div className="flex items-center mb-6">
                    <div className={`w-16 h-16 bg-green-400/10 border-2 border-green-400/20 rounded-full flex items-center justify-center mr-4 shadow-lg group-hover:bg-green-400/20 group-hover:border-green-400/40 transition-all duration-300`}>
                      <span className="text-green-400 font-black text-xl">{testimonial.initials}</span>
                    </div>
                    <div>
                      <div className="font-bold text-xl text-white">{testimonial.name}</div>
                      <div className="text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-6 text-lg leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex text-green-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900/50 backdrop-blur-sm border-y border-gray-800/50 relative">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Organize Your Next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
              Hackathon?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful organizers who trust HackForge to bring their innovation events to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
            <Button size="lg" className="text-xl px-10 py-5 shadow-2xl">
              Get Started - It's Free
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <Button size="lg" variant="outline" className="text-xl px-10 py-5">
              Schedule a Demo
            </Button>
          </div>

          <p className="text-sm text-gray-500">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
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

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.3);
          }
          100% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4);
          }
        }

        .glow-effect {
          animation: glow 2s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}