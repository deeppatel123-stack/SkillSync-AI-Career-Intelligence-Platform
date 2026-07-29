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
  analyzeResume: (body) =>
    request('/ai/resume-analysis', { method: 'POST', body: JSON.stringify(body) }),

  recommendCareerRole: (body) =>
    request('/ai/career-role', { method: 'POST', body: JSON.stringify(body) }),

  analyzeSkillGap: (body) =>
    request('/ai/skill-gap', { method: 'POST', body: JSON.stringify(body) }),

  generateLearningRoadmap: (body) =>
    request('/ai/learning-roadmap', { method: 'POST', body: JSON.stringify(body) }),

  getCareers: () => request('/ai/careers'),

  getCollegeStatistics: () => request('/college/statistics'),
  getCompanyStatistics: () => request('/company/statistics'),

  getStudentProfile: () => request('/users/profile/student'),
  updateStudentProfile: (body) =>
    request('/users/profile/student', { method: 'PUT', body: JSON.stringify(body) }),
};

export default aiApi;
