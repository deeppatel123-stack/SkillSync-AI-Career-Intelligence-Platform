/**
 * AI Routes – maps AI feature endpoints to controllers.
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { requireAuth, requireStudent } = require('../middleware/authMiddleware');

// ML Prediction routes (auth required)
router.post('/profile-analysis', requireAuth, requireStudent, aiController.analyzeProfile);
router.post('/career-role', requireAuth, requireStudent, aiController.recommendCareerRole);
router.post('/skill-gap', requireAuth, aiController.analyzeSkillGap);
router.post('/learning-roadmap', requireAuth, aiController.generateLearningRoadmap);

// Data routes
router.get('/careers', aiController.getCareers);
module.exports = router;
