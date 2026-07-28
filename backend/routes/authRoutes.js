const express = require('express');
const { body } = require('express-validator');
const { register, login, adminRegister, adminLogin, logout, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const { handleValidation } = require('../middleware/validateMiddleware');

const router = express.Router();

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

router.post('/register', registerRules, handleValidation, register);
router.post('/login', loginRules, handleValidation, login);
router.post('/admin/register', adminRegisterRules, handleValidation, adminRegister);
router.post('/admin/login', loginRules, handleValidation, adminLogin);
router.post('/logout', logout);
router.get('/me', requireAuth, getMe);

module.exports = router;
