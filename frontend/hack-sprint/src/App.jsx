import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import HideRoute from './components/HideRoute';
import Loader from './components/Loader';
import Quest from './pages/Quest';
import About from './pages/About';
import Admin from './pages/Admin';
import Login from './pages/Login.jsx';
import Questions from './pages/Questions.jsx';
import NotFoundPage from './pages/NotFound';
import ActiveHackathons from './pages/ActiveHackathons';
import ExpiredHackathons from './pages/ExpiredHackathons';
import Dashboard from './pages/Dashboard.jsx';
import Verification from './components/Verification.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import AllHackathons from './pages/AllHackathons.jsx';
import HackathonDetails from './pages/Hackathon.jsx';
import { RegistrationForm } from './hackathon/RegistrationForm.jsx';


import Leaderboard from './pages/Leaderboard.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authWait, setAuthWait] = useState(false);

  const AuthenticateRoute = ({ element }) => {
    if (!authWait) return null;
    return isAuthenticated ? element : <Navigate to="/account/login" />;
  };

  return (
    <Router>
      {/* If you use RouteHandler to set auth state, re-enable it */}
      {/* <RouteHandler setIsAuthenticated={setIsAuthenticated} setAuthWait={setAuthWait} /> */}

      <Loader />

      {/* Navbar visible on all normal routes */}
      <HideRoute>
        <Navbar />
      </HideRoute>

      <Routes>
        <Route path="/" element={<Home />} caseSensitive />
        <Route path="/hackathons" element={<AllHackathons />} caseSensitive />
        <Route path="/activehackathons" element={<ActiveHackathons />} caseSensitive />
        <Route path="/expiredhackathons" element={<ExpiredHackathons />} caseSensitive />
        <Route path="/quest" element={<Quest />} caseSensitive />
        <Route path="/about" element={<About />} caseSensitive />
        <Route path="/admin" element={<Admin />} caseSensitive />
        <Route path="/questions" element={<Questions />} caseSensitive />
        <Route path="/account/login" element={<Login />} caseSensitive />
        <Route path="/account/verify-email" element={<Verification />} caseSensitive />
        <Route path="/account/reset-password" element={<ResetPassword />} caseSensitive />
        <Route path="/hackathon/:id" element={<HackathonDetails />} />
        <Route path="/hackathon/RegistrationForm/:id" element={<RegistrationForm />} />

        {/* NEW: Leaderboard route */}
        <Route path="/leaderboard" element={<Leaderboard />} caseSensitive />

        <Route path="/dashboard" element={<AuthenticateRoute element={<Dashboard />} />} caseSensitive />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Footer visible on all normal routes */}
      <HideRoute>
        <Footer />
      </HideRoute>
    </Router>
  );
}

export default App;
