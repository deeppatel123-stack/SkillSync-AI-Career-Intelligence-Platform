import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import StudentDashboard from './pages/StudentDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ViewOpportunities from './pages/ViewOpportunities';
import AddOpportunity from './pages/AddOpportunity';
import Applications from './pages/Applications';
import ProfileSettings from './pages/ProfileSettings';

// AI Feature Pages
import ResumeAnalysis from './pages/ResumeAnalysis';
import CareerRoleRecommendation from './pages/CareerRoleRecommendation';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import LearningRoadmap from './pages/LearningRoadmap';

// Trending Skills
import TrendingSkills from './pages/TrendingSkills';

// Placement Statistics
import PlacementStatistics from './pages/PlacementStatistics';

// Student Profile
import StudentProfile from './pages/StudentProfile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/opportunities" element={<ViewOpportunities />} />
      <Route path="/opportunities/add" element={<AddOpportunity />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/profile" element={<ProfileSettings />} />

      {/* AI Feature Routes */}
      <Route path="/ai/resume-analysis" element={<ResumeAnalysis />} />
      <Route path="/ai/career-role" element={<CareerRoleRecommendation />} />
      <Route path="/ai/skill-gap" element={<SkillGapAnalysis />} />
      <Route path="/ai/trending-skills" element={<TrendingSkills />} />

      {/* Learning Hub (separate from AI) */}
      <Route path="/learning-hub/roadmap" element={<LearningRoadmap />} />

      {/* Placement Statistics */}
      <Route path="/ai/placement-statistics" element={<PlacementStatistics />} />

      {/* Student Profile */}
      <Route path="/student/profile" element={<StudentProfile />} />
    </Routes>
  );
}
