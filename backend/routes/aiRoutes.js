/**
 * AI Routes – maps AI feature endpoints to controllers.
 */

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const aiController = require('../controllers/aiController');

// Public AI routes (no auth required for basic predictions)
router.post('/predict-placement', aiController.predictPlacement);
router.post('/recommend-career', aiController.recommendCareer);
router.post('/learning-roadmap', aiController.generateLearningRoadmap);

// Data routes
router.get('/careers', aiController.getCareers);
router.get('/placement-statistics', aiController.getPlacementStatistics);

// Auth-protected routes
router.get('/predictions', requireAuth, aiController.getPredictionHistory);

module.exports = router;
