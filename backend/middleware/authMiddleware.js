const User = require('../models/User');

/**
 * Require a logged-in user (session must have userId).
 */
async function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, message: 'Please login first' });
  }

  try {
    const user = await User.findById(req.session.userId);
    if (!user || !user.isActive) {
      req.session.destroy(() => {});
      return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}

/** Only students */
function requireStudent(req, res, next) {
  if (req.user.role !== 'student') {
    return res.status(403).json({ success: false, message: 'Students only' });
  }
  next();
}

/** College or company organizers */
function requireOrganizer(req, res, next) {
  if (req.user.role !== 'college' && req.user.role !== 'company') {
    return res.status(403).json({ success: false, message: 'Organizers only (college/company)' });
  }
  next();
}

/** Superadmin only */
function requireAdmin(req, res, next) {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
}

module.exports = { requireAuth, requireStudent, requireOrganizer, requireAdmin };
