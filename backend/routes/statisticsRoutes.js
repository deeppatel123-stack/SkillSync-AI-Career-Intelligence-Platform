const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const stats = require('../controllers/statisticsController');

router.get('/college/statistics', requireAuth, stats.getCollegeStatistics);
router.get('/company/statistics', requireAuth, stats.getCompanyStatistics);

module.exports = router;
