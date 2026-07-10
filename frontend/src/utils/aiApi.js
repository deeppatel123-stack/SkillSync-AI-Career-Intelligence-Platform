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

// AI API functions
export const aiApi = {
  // Placement Prediction - accepts arrays, backend converts to counts
  predictPlacement: (body) =>
    request('/ai/predict-placement', { method: 'POST', body: JSON.stringify(body) }),

  // Career Recommendation - accepts skills array, backend maps to ML features
  recommendCareer: (body) =>
    request('/ai/recommend-career', { method: 'POST', body: JSON.stringify(body) }),

  // Learning Roadmap
  generateLearningRoadmap: (body) =>
    request('/ai/learning-roadmap', { method: 'POST', body: JSON.stringify(body) }),

  // Get Data
  getCareers: () => request('/ai/careers'),
  getPlacementStatistics: () => request('/ai/placement-statistics'),
  getPredictionHistory: () => request('/ai/predictions'),

  // Trending Skills
  getTrendingSkills: () => request('/trending-skills'),
  getTrendingCategories: () => request('/trending-categories'),
  getRecommendedSkills: (body) =>
    request('/recommended-skills', { method: 'POST', body: JSON.stringify(body) }),

  // Statistics (college/company dashboards)
  getCollegeStatistics: () => request('/college/statistics'),
  getCompanyStatistics: () => request('/company/statistics'),

  // Student Profile
  getStudentProfile: () => request('/users/profile/student'),
  updateStudentProfile: (body) =>
    request('/users/profile/student', { method: 'PUT', body: JSON.stringify(body) }),
};

export default aiApi;
