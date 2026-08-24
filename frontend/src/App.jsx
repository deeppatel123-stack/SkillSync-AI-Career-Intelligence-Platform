import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';

import StudentDashboard from './pages/StudentDashboard';
import CollegeDashboard from './pages/CollegeDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
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

// Student Profile & Tools
import StudentProfile from './pages/StudentProfile';
import TodoPage from './pages/TodoPage';
import ResumeBuilder from './pages/ResumeBuilder';

import CampusDrives from './pages/CampusDrives';
import StudentManagement from './pages/StudentManagement';
import CandidateSearch from './pages/CandidateSearch';
import InterviewsPage from './pages/InterviewsPage';
import SavedOpportunities from './pages/SavedOpportunities';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* Student Portal Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/interviews"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <InterviewsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/saved"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <SavedOpportunities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/drives"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <CampusDrives />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai/profile-analysis"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ProfileAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai/career-role"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <CareerRoleRecommendation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai/skill-gap"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <SkillGapAnalysis />
          </ProtectedRoute>
        }
      />
      <Route
        path="/learning-hub/roadmap"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LearningRoadmap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ResumeBuilder />
          </ProtectedRoute>
        }
      />

      {/* College Portal Routes */}
      <Route
        path="/college/dashboard"
        element={
          <ProtectedRoute allowedRoles={['college']}>
            <CollegeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/college/drives"
        element={
          <ProtectedRoute allowedRoles={['college']}>
            <CampusDrives />
          </ProtectedRoute>
        }
      />
      <Route
        path="/college/students"
        element={
          <ProtectedRoute allowedRoles={['college']}>
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/college/events"
        element={
          <ProtectedRoute allowedRoles={['college']}>
            <CampusDrives />
          </ProtectedRoute>
        }
      />

      {/* Company Portal Routes */}
      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/candidates"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <CandidateSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/interviews"
        element={
          <ProtectedRoute allowedRoles={['company']}>
            <InterviewsPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Portal Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Shared Authenticated Routes */}
      <Route
        path="/opportunities"
        element={
          <ProtectedRoute>
            <ViewOpportunities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/opportunities/add"
        element={
          <ProtectedRoute allowedRoles={['college', 'company']}>
            <AddOpportunity />
          </ProtectedRoute>
        }
      />
      <Route
        path="/opportunities/edit/:id"
        element={
          <ProtectedRoute allowedRoles={['college', 'company']}>
            <AddOpportunity />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/todo"
        element={
          <ProtectedRoute>
            <TodoPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

