const express = require('express');
const router = express.Router();
const { requireAuth, requireStudent } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

router.get('/student', requireAuth, requireStudent, profileController.getStudentProfile);
router.put('/student', requireAuth, requireStudent, profileController.updateStudentProfile);

module.exports = router;
