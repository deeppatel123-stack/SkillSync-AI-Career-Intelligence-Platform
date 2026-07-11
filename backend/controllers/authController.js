const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendEmail } = require('../config/email');

/** Save user id in session cookie */
function loginSession(req, user) {
  req.session.userId = user._id.toString();
}

/**
 * POST /api/auth/register
 * Register student, college, or company
 */
async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
    });

    loginSession(req, user);

    // Welcome email (optional – skipped if email not configured)
    await sendEmail({
      to: user.email,
      subject: 'Welcome to SkillSync',
      text: `Hi ${user.name}, your ${role} account was created successfully.`,
      html: `<p>Hi <strong>${user.name}</strong>,</p><p>Welcome to SkillSync! Your account is ready.</p>`,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found. Please register first.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    // Admin must use admin login route
    if (user.role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Please use the admin login page' });
    }

    loginSession(req, user);

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/admin/register
 */
async function adminRegister(req, res) {
  try {
    const { name, email, password, organization, phone } = req.body;

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: 'superadmin',
      organization: organization || 'SkillSync',
      phone: phone || '',
    });

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully! You can now login.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/admin/login
 */
async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), role: 'superadmin' });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    loginSession(req, user);

    res.json({
      success: true,
      message: 'Admin login successful',
      user: user.toPublicJSON(),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /api/auth/logout
 */
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Could not logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out successfully' });
  });
}

/**
 * GET /api/auth/me – current logged-in user from session
 */
async function getMe(req, res) {
  res.json({ success: true, user: req.user.toPublicJSON() });
}

module.exports = {
  register,
  login,
  adminRegister,
  adminLogin,
  logout,
  getMe,
};
