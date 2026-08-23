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
import ProfileAnalysis from './pages/ProfileAnalysis';
import CareerRoleRecommendation from './pages/CareerRoleRecommendation';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import LearningRoadmap from './pages/LearningRoadmap';

// Student Profile
import StudentProfile from './pages/StudentProfile';
import TodoPage from './pages/TodoPage';
import ResumeBuilder from './pages/ResumeBuilder';

import CollegeDashboard from './pages/CollegeDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import CampusDrives from './pages/CampusDrives';
import StudentManagement from './pages/StudentManagement';
import CandidateSearch from './pages/CandidateSearch';
import InterviewsPage from './pages/InterviewsPage';
import SavedOpportunities from './pages/SavedOpportunities';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* Role Dashboards */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/college/dashboard" element={<CollegeDashboard />} />
      <Route path="/company/dashboard" element={<CompanyDashboard />} />
      <Route path="/organizer/dashboard" element={<CollegeDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      {/* Role Specific Routes */}
      <Route path="/college/drives" element={<CampusDrives />} />
      <Route path="/college/students" element={<StudentManagement />} />
      <Route path="/college/events" element={<CampusDrives />} />

      <Route path="/company/candidates" element={<CandidateSearch />} />
      <Route path="/company/interviews" element={<InterviewsPage />} />

      <Route path="/student/interviews" element={<InterviewsPage />} />
      <Route path="/student/saved" element={<SavedOpportunities />} />
      <Route path="/student/drives" element={<CampusDrives />} />

      {/* Shared Platform Routes */}
      <Route path="/opportunities" element={<ViewOpportunities />} />
      <Route path="/opportunities/add" element={<AddOpportunity />} />
      <Route path="/opportunities/edit/:id" element={<AddOpportunity />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/profile" element={<ProfileSettings />} />

      {/* AI Feature Routes */}
      <Route path="/ai/profile-analysis" element={<ProfileAnalysis />} />
      <Route path="/ai/career-role" element={<CareerRoleRecommendation />} />
      <Route path="/ai/skill-gap" element={<SkillGapAnalysis />} />

      {/* Learning Hub */}
      <Route path="/learning-hub/roadmap" element={<LearningRoadmap />} />

      {/* Student Profile */}
      <Route path="/student/profile" element={<StudentProfile />} />

      {/* Resume Builder */}
      <Route path="/resume" element={<ResumeBuilder />} />

      {/* To-Do List */}
      <Route path="/todo" element={<TodoPage />} />
    </Routes>
  );
}
