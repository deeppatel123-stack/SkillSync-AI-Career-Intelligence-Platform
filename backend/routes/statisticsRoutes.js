const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware');
const statisticsController = require('../controllers/statisticsController');

router.get('/college/statistics', requireAuth, statisticsController.getCollegeStatistics);
router.get('/company/statistics', requireAuth, statisticsController.getCompanyStatistics);

module.exports = router;
