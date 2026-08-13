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
    const msg = data.message || data.errors?.[0]?.message || 'Request failed';
    throw new Error(msg);
  }

  return data;
}

export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  adminRegister: (body) => request('/auth/admin/register', { method: 'POST', body: JSON.stringify(body) }),
  adminLogin: (body) => request('/auth/admin/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

export const userApi = {
  getAll: () => request('/users'),
  getStats: () => request('/users/stats'),
  updateProfile: (body) => request('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  getSaved: () => request('/users/saved'),
  saveOpportunity: (id) => request(`/users/saved/${id}`, { method: 'POST' }),
  unsaveOpportunity: (id) => request(`/users/saved/${id}`, { method: 'DELETE' }),
};

export const notificationApi = {
  list: () => request('/notifications'),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request('/notifications/read-all', { method: 'POST' }),
};

export const opportunityApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/opportunities${q ? `?${q}` : ''}`);
  },
  count: () => request('/opportunities/count'),
  get: (id) => request(`/opportunities/${id}`),
  create: (body) => request('/opportunities', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/opportunities/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  review: (id, reviewStatus) =>
    request(`/opportunities/${id}/review`, { method: 'PATCH', body: JSON.stringify({ reviewStatus }) }),
  remove: (id) => request(`/opportunities/${id}`, { method: 'DELETE' }),
  dashboardStats: () => request('/opportunities/dashboard/stats'),
};

export const applicationApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/applications${q ? `?${q}` : ''}`);
  },
  create: (formData) =>
    fetch(`${API_BASE}/applications`, {
      method: 'POST',
      credentials: 'include',
      body: formData, 
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      return data;
    }),
  updateStatus: (id, status) =>
    request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id) => request(`/applications/${id}`, { method: 'DELETE' }),
};

export const taskApi = {
  list: (filter = '') => {
    const q = filter ? `?filter=${filter}` : '';
    return request(`/tasks${q}`);
  },
  create: (title) => request('/tasks', { method: 'POST', body: JSON.stringify({ title }) }),
  toggle: (id) => request(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  remove: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};

export default { authApi, userApi, opportunityApi, applicationApi, taskApi, notificationApi };
