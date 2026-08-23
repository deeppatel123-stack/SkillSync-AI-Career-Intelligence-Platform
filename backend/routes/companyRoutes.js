const express = require('express');
const {
  getCompanyDashboardStats,
  searchCandidates,
  addRecruiterNote,
  updateCompanyProfile,
} = require('../controllers/companyController');
const { requireAuth, requireCompany } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/stats', requireCompany, getCompanyDashboardStats);
router.get('/candidates', requireCompany, searchCandidates);
router.post('/applications/:applicationId/note', requireCompany, addRecruiterNote);
router.put('/profile', requireCompany, updateCompanyProfile);

module.exports = router;
