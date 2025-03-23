import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom"; // Add this
import Hero from "./components/Hero";
import JobCategories from "./components/JobCategories";
import FeaturedJobs from "./components/FeaturedJobs";
import JobListings from "./components/JobListings";
import JobDetails from "./components/JobDetails";
import ThemeToggle from "./components/ThemeToggle";
import Login from "./components/Login";
import Signup from "./components/Signup";
import JobSeekerDashboard from "./components/JobSeekerDashboard";
import EmployerDashboard from "./components/EmployerDashboard";
import PostJob from "./components/PostJob";
import ProtectedRoute from "./components/ProtectedRoute";
import './styles/App.css'; // Add this for styling
import ProfileEdit from './components/ProfileEdit';
import ProfileView from './components/ProfileView';
function Home() {
    return (
        <>
            <Hero />
            <JobCategories />
            <FeaturedJobs />
        </>
    );
}

function AppContent() {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="App">
            <header className="app-header">
                <ThemeToggle />
                {user ? (
                    <button onClick={logout} className="auth-btn logout-btn">Logout</button>
                ) : (
                    <div className="auth-buttons">
                        <Link to="/signup" className="auth-btn signup-btn">Sign Up</Link>
                        <Link to="/login" className="auth-btn login-btn">Login</Link>
                    </div>
                )}
            </header>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<JobListings />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                    path="/dashboard/job-seeker"
                    element={<ProtectedRoute allowedRole="job_seeker"><JobSeekerDashboard /></ProtectedRoute>}
                />
                <Route
                    path="/dashboard/employer"
                    element={<ProtectedRoute allowedRole="employer"><EmployerDashboard /></ProtectedRoute>}
                />
                <Route
                    path="/post-job"
                    element={<ProtectedRoute allowedRole="employer"><PostJob /></ProtectedRoute>}
                />
                <Route
                    path="/profile/edit"
                    element={<ProtectedRoute allowedRole="job_seeker"><ProfileEdit /></ProtectedRoute>}
                />
                <Route path="/profile/:user_id" element={<ProfileView />} />
            </Routes>
        </div>
    );
}
function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

export default App;