import React, { useState, useEffect } from 'react';
import "./App.css"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import GithubAuthHandler from './components/GithubAuthHandler.jsx';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import HideRoute from './components/HideRoute';
import HideRouteFooter from './components/HideRouteFooter';
import Loader from './components/Loader';
import Quest from './pages/Quest';
import About from './pages/About';
import Admin from './pages/Admin';
import Login from './pages/Login.jsx';
import Questions from './pages/Questions.jsx';
import NotFoundPage from './pages/NotFound';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ActiveHackathons from './pages/ActiveHackathons';
import ExpiredHackathons from './pages/ExpiredHackathons';
import Dashboard from './pages/Dashboard.jsx';
import Signup from './pages/Signup.jsx';
import Verification from './components/Verification.jsx';
import ResetPassword from './components/ResetPassword.jsx';
import RouteHandler from './components/RouteHandler.jsx'
import AllHackathons from './pages/AllHackathons.jsx'
import { ToastContainer } from 'react-toastify';
import HackathonDetails from './pages/Hackathon.jsx';
import { RegistrationForm } from './hackathon/RegistrationForm.jsx';
import Leaderboard from './pages/LeaderBoard.jsx';
import TeamDetails from './pages/TeamDetails.jsx';
import VerifyEmail from './components/verifyEmail.jsx';
import ForgotPassword from './components/forgotPassword.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import UnderConstruction from './pages/Devlopment.jsx'
import Studenthome from './pages/Studenthome.jsx';
import Adminhome from './pages/Adminhome.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminSignup from './pages/AdminSignup.jsx';
import AdminProfile from './pages/AdminProfile.jsx';
import RecentlyStartedPage from './admin/recenthackathon.jsx';
import LiveHackathonsPage from './admin/livehackathon.jsx';
import EndedHackathonsPage from './admin/endedhackathon.jsx';
import HackathonUsersPage from './admin/userlist.jsx';
import UserSubmissionDetailPage from './admin/usersubmission.jsx';
import ParticipantPoliciesPage from './pages/Participation.jsx';
import OrganizerPlaybookPage from './pages/Organiser.jsx';
import LegalSupportPage from './pages/TermsCond.jsx';
import CreateHackathonPage from './pages/CreateHackathonPage.jsx';
import AdminNavbar from './components/AdminNavbar.jsx';
import HideAdminRoutes from './components/HideAdminRoutes.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authWait, setAuthWait] = useState(false)

  const AuthenticateRoute = ({ element, admin = false, authWait, isAuthenticated }) => {
    if (!authWait) return null;

    if (admin) {
      const isAdminLoggedIn = !!localStorage.getItem("adminToken");
      return isAdminLoggedIn ? element : <Navigate to="/adminlogin" />;
    }

    return isAuthenticated ? element : <Navigate to="/account/login" />;
  };

  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstall, setShowInstall] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    return () =>
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
  }, [])

  const handleInstallClick = async () => {
    deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === "accepted") setShowInstall(false)
    setDeferredPrompt(null)
  }

  return (
    <>
      {showInstall && (
        <button className="install-btn bg-gray-800 text-green-400 rounded-lg border-1 border-green-400/20 hover:bg-gray-800/20 duration-400" onClick={handleInstallClick}>
          Download App
        </button>
      )}
      <Router>
        <RouteHandler setIsAuthenticated={setIsAuthenticated} setAuthWait={setAuthWait} />
        <ScrollToTop />
        <Loader />
        <HideRoute>
          <Navbar />
        </HideRoute>
        <HideAdminRoutes>
          <AdminNavbar />
        </HideAdminRoutes>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} caseSensitive />
          <Route path="/studenthome" element={<Studenthome />} caseSensitive />
          <Route path="/adminhome" element={<Adminhome />} caseSensitive />
          <Route path="/adminlogin" element={<AdminLogin />} caseSensitive />
          <Route path="/admin/signup" element={<AdminSignup />} caseSensitive />

          <Route path="/activehackathons" element={<ActiveHackathons />} caseSensitive></Route>
          <Route path="/expiredhackathons" element={<ExpiredHackathons />} caseSensitive></Route>
          <Route path="/quest" element={<Quest />} caseSensitive />
          <Route path="/about" element={<About />} caseSensitive />
          <Route path="/hackathons" element={<AllHackathons />} caseSensitive />

          <Route path="/hacksprintTeraBaap" element={<Admin />} caseSensitive />
          <Route path="/admin" element={<AuthenticateRoute element={<AdminProfile />} admin={true} authWait={authWait} isAuthenticated={isAuthenticated} />} caseSensitive />
          <Route path="/admin/recentlystarted"
            element={<AuthenticateRoute element={<RecentlyStartedPage />} admin={true} authWait={authWait} isAuthenticated={isAuthenticated} />}
            caseSensitive
          />
          <Route path="/admin/livehackathons"
            element={<AuthenticateRoute element={<LiveHackathonsPage />} admin={true} authWait={authWait} isAuthenticated={isAuthenticated} />}
            caseSensitive
          />
          <Route path="/admin/endedhackathons"
            element={<AuthenticateRoute element={<EndedHackathonsPage />} admin={true} authWait={authWait} isAuthenticated={isAuthenticated} />}
            caseSensitive
          />

          <Route path="/questions" element={<AuthenticateRoute element={<Questions />} authWait={authWait}
            isAuthenticated={isAuthenticated} />} caseSensitive />
          <Route path="/account/login" element={<Login />} caseSensitive></Route>
          <Route path="/github-auth-handler" element={<GithubAuthHandler />} caseSensitive></Route>
          <Route path="/account/signup" element={<Signup />} caseSensitive></Route>
          <Route path="/account/reset-password" element={<AuthenticateRoute element={<ResetPassword />} authWait={authWait}
            isAuthenticated={isAuthenticated} />} caseSensitive></Route>

          <Route path="/hackathon/:id" element={<HackathonDetails />} />
          <Route path="/hackathon/RegistrationForm/:id" element={<AuthenticateRoute element={<RegistrationForm />} authWait={authWait}
            isAuthenticated={isAuthenticated} />} />

          <Route path="/hackathon/:hackathonId/team/:teamId" element={<AuthenticateRoute element={<TeamDetails />} authWait={authWait}
            isAuthenticated={isAuthenticated} />} />

          <Route
            path="/dashboard"
            element={
              <AuthenticateRoute
                element={<Dashboard />}
                authWait={authWait}
                isAuthenticated={isAuthenticated}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/account/forgot-password" element={<ForgotPassword />} caseSensitive></Route>
          <Route path='/leaderboard' element={<Leaderboard />} />

          <Route path='/hackathon/:slug/submission/:id' element={<AuthenticateRoute element={<UserSubmissionDetailPage />} authWait={authWait}
            isAuthenticated={isAuthenticated} />} />
          <Route path="/participation-policies" element={<ParticipantPoliciesPage />} caseSensitive />
          <Route
            path="/createHackathon"
            element={
              <AuthenticateRoute
                element={<CreateHackathonPage />}
                admin={true}
                authWait={authWait}
                isAuthenticated={isAuthenticated}
              />
            }
            caseSensitive
          />
          <Route
            path="/admin/:slug/usersubmissions"
            element={
              <AuthenticateRoute
                element={<HackathonUsersPage />}
                admin={true}
                authWait={authWait}
                isAuthenticated={isAuthenticated}
              />
            }
          />

          <Route path="/organizer-ruleBook" element={<OrganizerPlaybookPage />} caseSensitive />
          <Route path="/organizer-ruleBook" element={<OrganizerPlaybookPage />} caseSensitive />
          <Route path="/terms-and-condition" element={<LegalSupportPage />} caseSensitive />
        </Routes>

        <HideRouteFooter>
          <Footer />
        </HideRouteFooter>
      </Router>
    </>
  );
}

export default App;