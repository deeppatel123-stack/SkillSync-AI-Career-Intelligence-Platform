const express = require('express');
const {
  scheduleInterview,
  getInterviews,
  updateInterviewStatus,
  deleteInterview,
} = require('../controllers/interviewController');
const { requireAuth, requireCompany } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/', getInterviews);
router.post('/', requireCompany, scheduleInterview);
router.patch('/:id', updateInterviewStatus);
router.delete('/:id', deleteInterview);

module.exports = router;
