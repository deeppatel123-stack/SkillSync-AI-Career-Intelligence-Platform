/**
 * Profile Routes – student profile endpoints.
 */

const express = require('express');
const router = express.Router();
const { requireAuth, requireStudent } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

// Student profile routes (require auth + student role)
router.get('/student', requireAuth, requireStudent, profileController.getStudentProfile);
router.put('/student', requireAuth, requireStudent, profileController.updateStudentProfile);

module.exports = router;
