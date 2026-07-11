const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const trendingController = require('../controllers/trendingController');

router.get('/trending-skills', trendingController.getTrendingSkills);
router.get('/trending-categories', trendingController.getTrendingCategories);
router.post('/recommended-skills', requireAuth, trendingController.getRecommendedSkills);

module.exports = router;
