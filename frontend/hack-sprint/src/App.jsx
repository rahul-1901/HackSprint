import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// --- Placeholder Components to make the app self-contained and runnable in Canvas ---
// In a real project, these would be in their respective files (e.g., './components/Navbar', etc.)
// and imported normally. This approach avoids "Could not resolve" errors in the Canvas environment.

// Placeholder for App.css styles (Tailwind CSS is assumed to be loaded globally via script)
const AppStyles = () => null;

// Placeholder for Loader component
const Loader = () => (
  <div className="flex items-center justify-center p-4 bg-gray-900 text-white">
    {/* Basic loading indicator */}
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
    <p className="ml-3 text-lg">Loading...</p>
  </div>
);

// Placeholder for Navbar component
const Navbar = () => (
  <nav className="p-4 bg-gray-800 text-white flex justify-between items-center fixed top-0 w-full z-50 shadow-md rounded-b-lg">
    <div className="text-2xl font-bold text-green-400">HackSprint</div>
    <div className="space-x-4">
      <a href="/" className="hover:text-green-300 transition-colors rounded-md px-2 py-1">Home</a>
      <a href="/quest" className="hover:text-green-300 transition-colors rounded-md px-2 py-1">Quest</a>
      <a href="/about" className="hover:text-green-300 transition-colors rounded-md px-2 py-1">About</a>
      <a href="/login" className="hover:text-green-300 transition-colors rounded-md px-2 py-1">Login</a>
    </div>
  </nav>
);

// Placeholder for Footer component
const Footer = () => (
  <footer className="p-4 bg-gray-800 text-gray-400 text-center text-sm fixed bottom-0 w-full z-50 shadow-inner rounded-t-lg">
    <p>&copy; 2025 HackSprint. All rights reserved.</p>
  </footer>
);

// Placeholder for HideRoute component
// This component conditionally renders children based on the current path
const HideRoute = ({ children }) => {
  const location = useLocation();
  // Paths where Navbar/Footer should be hidden
  const hiddenPaths = ['/login']; // Add other paths where you want to hide these
  const shouldHide = hiddenPaths.includes(location.pathname);
  return shouldHide ? null : children;
};

// Placeholder for Home page component
const Home = () => {
  // Simplified Home component content for demonstrative purposes in this self-contained app
  return (
    <div className='bg-gray-900 min-h-screen pt-20 pb-20'> {/* Added pt/pb to account for fixed Navbar/Footer */}
      <Loader /> {/* Loader is defined as a placeholder above */}

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center overflow-hidden relative p-4">
          <p style={{top: '37vh'}} className="absolute text-[80px] md:text-[180px] ZaptronFont text-transparent bg-clip-text bg-gradient-to-b from-green-400 to-green-800 tracking-widest z-10 text-center w-full">
              HackSprint
          </p>

          <button
              className="absolute border-2 border-green-800 right-4 md:right-[0.5vw] text-lg bg-gray-900 hover:bg-gray-800 font-semibold text-gray-400 rounded-lg hover:text-white text-center px-4 py-[5px] transition duration-400 cursor-pointer"
              style={{ top: '10vh' }}
          >
              Leaderboard
          </button>
          
          {/* Example text boxes - adjusted styling for better responsiveness/view */}
          <div
              className="absolute border border-green-400 rounded-lg text-white text-center p-2 text-xs md:px-4 md:py-2 max-w-[200px] md:max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-1200 cursor-default"
              style={{ top: '25vh', left: '5vw' }}
          >
              There's nothing like the bonding experience of fixing a deployment bug five minutes before the deadline.
          </div>
          <div
              className="absolute border border-green-400 rounded-lg text-white text-center p-2 text-xs md:px-4 md:py-2 max-w-[200px] md:max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-1200 cursor-default"
              style={{ top: '25vh', right: '5vw' }}
          >
              Trust in peer-to-peer systems is tricky. In hackathons, it's easier—we trust that someone will push to main at 3AM.
          </div>
          <div
              className="absolute border border-green-400 rounded-lg text-white text-center p-2 text-xs md:px-4 md:py-2 max-w-[200px] md:max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-1200 cursor-pointer"
              style={{ top: '65vh', left: '5vw' }}
          >
              Every sprint starts with hope and ends with console.logs. Somewhere in between, there's caffeine, chaos.
          </div>
          <div
              className="absolute border border-green-400 rounded-lg text-white text-center p-2 text-xs md:px-4 md:py-2 max-w-[200px] md:max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-1200 cursor-pointer"
              style={{ top: '65vh', right: '5vw' }}
          >
              Developers spend nearly 50% of their time just reading code—yet during hackathons, we compress that into 5 minutes.
          </div>
          <div
              className="absolute border border-green-400 rounded-lg text-white text-center p-2 text-xs md:px-4 md:py-2 max-w-[200px] md:max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-120 cursor-default"
              style={{ top: '75vh', left: '50%', transform: 'translateX(-50%)' }}
          >
              Hackathons are where “MVP” doesn’t just mean Minimum Viable Product—it also stands for "Mostly Violent Pushes".
          </div>
          <div
              className="absolute border border-green-400 rounded-lg text-white text-center p-2 text-xs md:px-4 md:py-2 max-w-[200px] md:max-w-xs opacity-7 hover:opacity-50 transition-opacity duration-1200 cursor-default"
              style={{ top: '15vh', left: '50%', transform: 'translateX(-50%)' }}
          >
              They said use Git. We did. Now half the time is spent resolving merge conflicts.
          </div>
      </div>

      {/* Active Hackathons Section */}
      <div className='flex items-center justify-center mt-30 p-4'>
          <div className='flex flex-col w-full max-w-[80vw]'> {/* Added max-w */}
              <p className='ZaptronFont text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-green-800 flex items-center gap-2 mb-6'>
                  <span className="h-3 w-3 rounded-full bg-green-300 animate-pulse shadow-lg mt-[-4px]"></span>
                  Active Hackathons
              </p>
              {/* Dummy hackathon cards (responsive adjustments) */}
              <div className='border-1 border-green-200 bg-white/5 fade-section mb-5 cursor-pointer backdrop-blur-sm border border-green-500/20 hover:border-green-700 hover:scale-101 transition duration-300 h-auto px-5 py-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center'>
                  <div className='flex flex-col w-full md:w-[60%]'> {/* Adjusted width */}
                      <p className='font-semibold text-xl md:text-2xl text-white/90'>Building HackSprint Platform</p>
                      <p className='text-gray-400 text-sm mt-[0.5px]'>A centralized platform for hackathon, dev quest's and events</p>
                      <div className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8 ml-[-1px] mt-2'>
                          <div className='flex items-center text-sm'>
                              {/* Users icon placeholder (replace with actual icon component in your local project) */} <span className='ml-1 mt-1 text-gray-400'>500 submissions</span>
                          </div>
                          <div className='flex items-center text-sm'>
                              {/* Calendar icon placeholder */} <span className='ml-1 mt-1 text-gray-400'>10/06/2025 - 20/06/2025</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-1 h-auto bg-green-500/10 px-4 py-2 rounded-full mt-4 md:mt-0">
                      {/* Timer icon placeholder */}
                      <span className="text-green-400 font-mono mt-[5px]">3d 14h 22m</span>
                  </div>
              </div>
              {/* Duplicate card for visual effect */}
              <div className='border-1 border-green-200 bg-white/5 cursor-pointer fade-section backdrop-blur-sm border border-green-500/20 hover:border-green-700 transition duration-300 hover:scale-101 mb-5 h-auto px-5 py-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center'>
                  <div className='flex flex-col w-full md:w-[60%]'>
                      <p className='font-semibold text-xl md:text-2xl text-white/90'>Building HackSprint Platform</p>
                      <p className='text-gray-400 text-sm mt-[0.5px]'>A centralized platform for hackathon, dev quest's and events</p>
                      <div className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8 ml-[-1px] mt-2'>
                          <div className='flex items-center text-sm'>
                              {/* Users icon placeholder */} <span className='ml-1 mt-1 text-gray-400'>500 submissions</span>
                          </div>
                          <div className='flex items-center text-sm'>
                              {/* Calendar icon placeholder */} <span className='ml-1 mt-1 text-gray-400'>10/06/2025 - 20/06/2025</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-1 h-auto bg-green-500/10 px-4 py-2 rounded-full mt-4 md:mt-0">
                      {/* Timer icon placeholder */}
                      <span className="text-green-400 font-mono mt-[5px]">3d 14h 22m</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Expired Hackathons Section */}
      <div className='flex items-center justify-center mt-10 p-4'>
          <div className='flex flex-col w-full max-w-[80vw]'>
              <div className='flex justify-between items-center flex-col md:flex-row text-center md:text-left mb-6'>
                  <p className='ZaptronFont text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-red-100 to-red-200 flex items-center gap-2 mb-4 md:mb-0'>
                      <span className="h-3 w-3 rounded-full bg-red-400 animate-pulse shadow-lg mt-[-4px]"></span>
                      Expired Hackathons
                  </p>
                  <button className="text-gray-400 cursor-pointer hover:text-gray-300 flex items-center gap-2 transition-colors">
                      View All {/* ArrowRight icon placeholder */}
                  </button>
              </div>
              {/* Dummy hackathon cards (responsive adjustments) */}
              <div className='border-1 border-green-200 bg-white/5 mb-5 cursor-pointer fade-section backdrop-blur-sm border border-green-500/20 hover:border-green-700 hover:scale-101 transition duration-300 h-auto px-5 py-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center'>
                  <div className='flex flex-col w-full md:w-[60%]'>
                      <p className='font-semibold text-xl md:text-2xl text-white/90'>Building HackSprint Platform</p>
                      <p className='text-gray-400 text-sm mt-[0.5px]'>A centralized platform for hackathon, dev quest's and events</p>
                      <div className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8 ml-[-1px] mt-2'>
                          <div className='flex items-center text-sm'>
                              {/* Users icon placeholder */} <span className='ml-1 mt-1 text-gray-400'>500 submissions</span>
                          </div>
                          <div className='flex items-center text-sm'>
                              {/* Calendar icon placeholder */} <span className='ml-1 mt-1 text-gray-400'>10/06/2025 - 20/06/2025</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-1 h-auto bg-green-500/10 px-4 py-2 rounded-full mt-4 md:mt-0">
                      {/* Timer icon placeholder */}
                      <span className="text-green-400 font-mono mt-[5px]">0d 0h 0m</span>
                  </div>
              </div>
              {/* Duplicate card for visual effect */}
              <div className='border-1 mb-40 border-green-200 bg-white/5 cursor-pointer fade-section backdrop-blur-sm border border-green-500/20 hover:border-green-700 transition duration-300 hover:scale-101 h-auto px-5 py-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center'>
                  <div className='flex flex-col w-full md:w-[60%]'>
                      <p className='font-semibold text-xl md:text-2xl text-white/90'>Building HackSprint Platform</p>
                      <p className='text-gray-400 text-sm mt-[0.5px]'>A centralized platform for hackathon, dev quest's and events</p>
                      <div className='flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-8 ml-[-1px] mt-2'>
                          <div className='flex items-center text-sm'>
                              {/* Users icon placeholder */} <span className='ml-1 mt-1 text-gray-400'>500 submissions</span>
                          </div>
                          <div className='flex items-center text-sm'>
                              {/* Calendar icon placeholder */} <span className='ml-1 mt-1 text-gray-400'>10/06/2025 - 20/06/2025</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-1 h-auto bg-green-500/10 px-4 py-2 rounded-full mt-4 md:mt-0">
                      {/* Timer icon placeholder */}
                      <span className="text-green-400 font-mono mt-[5px]">0d 0h 0m</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

// Placeholder for Quest page component
const Quest = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white pt-16 pb-16">
    <h2 className="text-4xl">Quest Page Content</h2>
    <p className="mt-4 text-gray-400">This is a placeholder for the Quest page.</p>
  </div>
);

// Placeholder for About page component
const About = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white pt-16 pb-16">
    <h2 className="text-4xl">About Us Page Content</h2>
    <p className="mt-4 text-gray-400">This is a placeholder for the About page.</p>
  </div>
);

// Placeholder for Login page component (GoogleOAuthProvider removed for Canvas compatibility)
const Login = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
    <h2 className="text-4xl font-bold mb-6">Login Page</h2>
    <p className="text-lg text-gray-300 mb-8 text-center max-w-md">
      Google OAuth integration is not supported in this self-contained Canvas environment.
      In your local project, the real Login component will handle Google authentication.
    </p>
    <button
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-lg"
      onClick={() => { /* alert removed */ console.log('Simulated Google Login Click'); }}
    >
      Sign in with Google (Simulated)
    </button>
  </div>
);

// Placeholder for NotFoundPage component
const NotFoundPage = ({ message = "The page you are looking for does not exist." }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8 text-center">{message}</p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <a 
          href="/" 
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-lg text-center"
        >
          Go to Homepage
        </a>
        <button
          onClick={() => window.history.back()}
          className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-lg text-center"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};


// --- Main App Component ---
function App() {

  // GoogleAuthWrapper is modified to use the placeholder Login component
  const GoogleAuthWrapper = () => {
    return <Login />;
  };

  return (
    <>
      <Router>
        {/* HideRoute, Navbar, and Footer are defined as placeholders above */}
        <HideRoute>
          <Navbar />
        </HideRoute>
        
        <Routes>
          {/* Main application routes using placeholder components */}
          <Route path="/" element={<Home />} caseSensitive></Route>
          <Route path="/quest" element={<Quest />} caseSensitive></Route>
          <Route path="/about" element={<About />} caseSensitive></Route>
          <Route path='/login' element={<GoogleAuthWrapper />} caseSensitive></Route>
          
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <HideRoute>
          <Footer />
        </HideRoute>
      </Router>
    </>
  );
}

export default App;
