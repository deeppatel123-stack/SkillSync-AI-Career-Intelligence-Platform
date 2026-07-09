/**
 * API helper – all requests go to the Express backend with session cookies.
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include', // send session cookie
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

// —— Auth ——
export const authApi = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  adminRegister: (body) => request('/auth/admin/register', { method: 'POST', body: JSON.stringify(body) }),
  adminLogin: (body) => request('/auth/admin/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

// —— Users ——
export const userApi = {
  getAll: () => request('/users'),
  getStats: () => request('/users/stats'),
  updateProfile: (body) => request('/users/profile', { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
};

// —— Opportunities ——
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

// —— Applications ——
export const applicationApi = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/applications${q ? `?${q}` : ''}`);
  },
  create: (formData) =>
    fetch(`${API_BASE}/applications`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // FormData for file upload – no Content-Type header
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Request failed');
      return data;
    }),
  updateStatus: (id, status) =>
    request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  remove: (id) => request(`/applications/${id}`, { method: 'DELETE' }),
};

export default { authApi, userApi, opportunityApi, applicationApi };
