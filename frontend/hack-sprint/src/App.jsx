import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import HideRoute from './components/HideRoute';
import Loader from './components/Loader';
import Quest from './pages/Quest';
import About from './pages/About';
import Login from './pages/Login.jsx';
import NotFoundPage from './pages/NotFound';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './pages/dashboard.jsx';
import Signup from './pages/Signup.jsx';
import Verification from './components/Verification.jsx';
import ResetPassword from './components/ResetPassword.jsx';

import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Router>
        <HideRoute>
          <Navbar />
        </HideRoute>

        <ToastContainer />

        <Routes>
          <Route path="/" element={<Home />} caseSensitive />
          <Route path="/quest" element={<Quest />} caseSensitive />
          <Route path="/about" element={<About />} caseSensitive />
          <Route path="/account/login" element={<Login />} caseSensitive />
          <Route path="/account/signup" element={<Signup />} caseSensitive />
          <Route path="/account/verify-email" element={<Verification />} caseSensitive />
          <Route path="/account/reset-password" element={<ResetPassword />} caseSensitive />
          <Route path="/dashboard" element={<Dashboard />} caseSensitive />
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