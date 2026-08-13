const express = require('express');
const {
  getAllUsers,
  getPlatformStats,
  updateProfile,
  deleteUser,
  changePassword,
  toggleSaveOpportunity,
  getSavedOpportunities,
} = require('../controllers/userController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes need login
router.use(requireAuth);

// GET /api/users/stats
router.get('/stats', requireAdmin, getPlatformStats);

// GET /api/users
router.get('/', requireAdmin, getAllUsers);

// PUT /api/users/profile
router.put('/profile', updateProfile);

// POST /api/users/change-password
router.post('/change-password', changePassword);

// GET /api/users/saved
router.get('/saved', getSavedOpportunities);

// POST /api/users/saved/:id
router.post('/saved/:id', toggleSaveOpportunity);

// DELETE /api/users/saved/:id
router.delete('/saved/:id', toggleSaveOpportunity);

// DELETE /api/users/:id
router.delete('/:id', requireAdmin, deleteUser);

module.exports = router;
