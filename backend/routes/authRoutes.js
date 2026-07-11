const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  adminRegister,
  adminLogin,
  logout,
  getMe,
} = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { handleValidation } = require('../middleware/validateMiddleware');

const router = express.Router();

// Validation rules
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'college', 'company']).withMessage('Invalid role'),
];

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const adminRegisterRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('organization').trim().notEmpty().withMessage('Organization is required'),
];

// POST /api/auth/register
router.post('/register', registerRules, handleValidation, register);

// POST /api/auth/login
router.post('/login', loginRules, handleValidation, login);

// POST /api/auth/admin/register
router.post('/admin/register', adminRegisterRules, handleValidation, adminRegister);

// POST /api/auth/admin/login
router.post('/admin/login', loginRules, handleValidation, adminLogin);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/me
router.get('/me', requireAuth, getMe);

module.exports = router;
