/**
 * AI API helper – communicates with Node.js backend which forwards to Django.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data.message || data.errors?.[0]?.message || 'AI request failed';
    throw new Error(msg);
  }

  return data;
}

export const aiApi = {
  // Resume Analysis
  analyzeResume: (body) =>
    request('/ai/resume-analysis', { method: 'POST', body: JSON.stringify(body) }),

  // Career Role Recommendation
  recommendCareerRole: (body) =>
    request('/ai/career-role', { method: 'POST', body: JSON.stringify(body) }),

  // Skill Gap Analysis
  analyzeSkillGap: (body) =>
    request('/ai/skill-gap', { method: 'POST', body: JSON.stringify(body) }),

  // Learning Roadmap
  generateLearningRoadmap: (body) =>
    request('/ai/learning-roadmap', { method: 'POST', body: JSON.stringify(body) }),

  // Get Data
  getCareers: () => request('/ai/careers'),
  getPlacementStatistics: () => request('/ai/placement-statistics'),

  // Trending Skills
  getTrendingSkills: () => request('/trending-skills'),
  getTrendingCategories: () => request('/trending-categories'),
  getRecommendedSkills: (body) =>
    request('/recommended-skills', { method: 'POST', body: JSON.stringify(body) }),

  // Statistics
  getCollegeStatistics: () => request('/college/statistics'),
  getCompanyStatistics: () => request('/company/statistics'),

  // Student Profile
  getStudentProfile: () => request('/users/profile/student'),
  updateStudentProfile: (body) =>
    request('/users/profile/student', { method: 'PUT', body: JSON.stringify(body) }),
};

export default aiApi;
