import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import HideRoute from './components/HideRoute'
import Loader from './components/Loader'
import Quest from './pages/Quest'
import About from './pages/About'
import Login from './pages/Login'
import NotFoundPage from './pages/NotFound';
import { GoogleOAuthProvider } from '@react-oauth/google'
import ActiveHackathons from './pages/ActiveHackathons';
import ExpiredHackathons from './pages/ExpiredHackathons';

function App() {
  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
        <Login></Login>
      </GoogleOAuthProvider>
    )
  };

  return (
    <>
      <Router>
        <HideRoute>
          <Navbar />
        </HideRoute>
        <Routes>
          <Route path="/" element={<Home />} caseSensitive></Route>
          <Route path="/activehackathons" element={<ActiveHackathons/>} caseSensitive></Route>
          <Route path="/expiredhackathons" element={<ExpiredHackathons/>} caseSensitive></Route>
          <Route path="/quest" element={<Quest />} caseSensitive></Route>
          <Route path="/about" element={<About />} caseSensitive></Route>
          <Route path='/login' element={<GoogleAuthWrapper />} caseSensitive></Route>
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
