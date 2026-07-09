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
import PlacementPrediction from './pages/PlacementPrediction';
import CareerRecommendation from './pages/CareerRecommendation';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import ResumeScore from './pages/ResumeScore';
import LearningRoadmap from './pages/LearningRoadmap';
import CandidateRanking from './pages/CandidateRanking';
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
      <Route path="/ai/placement-prediction" element={<PlacementPrediction />} />
      <Route path="/ai/career-recommendation" element={<CareerRecommendation />} />
      <Route path="/ai/skill-gap" element={<SkillGapAnalysis />} />
      <Route path="/ai/resume-score" element={<ResumeScore />} />
      <Route path="/ai/learning-roadmap" element={<LearningRoadmap />} />
      <Route path="/ai/candidate-ranking" element={<CandidateRanking />} />
      <Route path="/ai/placement-statistics" element={<PlacementStatistics />} />

      {/* Student Profile */}
      <Route path="/student/profile" element={<StudentProfile />} />
    </Routes>
  );
}
