/**
 * AI Routes – maps AI feature endpoints to controllers.
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// ML Prediction routes (no auth required)
router.post('/resume-analysis', aiController.analyzeResume);
router.post('/career-role', aiController.recommendCareerRole);
router.post('/skill-gap', aiController.analyzeSkillGap);
router.post('/learning-roadmap', aiController.generateLearningRoadmap);

// Data routes
router.get('/careers', aiController.getCareers);
router.get('/placement-statistics', aiController.getPlacementStatistics);

module.exports = router;
