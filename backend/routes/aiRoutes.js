const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requireAuth, requireStudent } = require('../middleware/authMiddleware');

router.post('/resume-analysis', requireAuth, requireStudent, aiController.analyzeResume);
router.post('/career-role', requireAuth, requireStudent, aiController.recommendCareerRole);
router.post('/skill-gap', requireAuth, aiController.analyzeSkillGap);
router.post('/learning-roadmap', requireAuth, aiController.generateLearningRoadmap);
router.get('/careers', aiController.getCareers);

module.exports = router;
