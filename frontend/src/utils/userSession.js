const SESSION_KEY = 'skillsync_user';
const REGISTERED_KEY = 'skillsync_registered_users';

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getRegisteredUsers() {
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function registerUser(user) {
  const users = getRegisteredUsers();
  const updated = [...users.filter((u) => u.email !== user.email), user];
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(updated));
}

export function findUserByEmail(email, seedUsers = []) {
  const normalized = email.trim().toLowerCase();
  const fromRegistered = getRegisteredUsers().find((u) => u.email.toLowerCase() === normalized);
  if (fromRegistered) return fromRegistered;
  return seedUsers.find((u) => u.email.toLowerCase() === normalized) || null;
}

export function getDashboardPath(role) {
  if (role === 'college' || role === 'company') return '/organizer/dashboard';
  if (role === 'superadmin') return '/admin/dashboard';
  return '/student/dashboard';
}

export function getAppRole(role) {
  if (role === 'college' || role === 'company') return 'organizer';
  if (role === 'superadmin') return 'admin';
  return 'student';
}

export function formatRoleLabel(role) {
  if (role === 'college') return 'College';
  if (role === 'company') return 'Company';
  if (role === 'student') return 'Student';
  if (role === 'superadmin') return 'Admin';
  return role;
}
