const express = require('express');
const {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/applicationController');
const { requireAuth, requireStudent } = require('../middleware/authMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(requireAuth);

// GET /api/applications
router.get('/', getApplications);

router.get('/:id', getApplicationById);

// POST /api/applications – optional resume file
router.post('/', requireStudent, uploadResume.single('resume'), createApplication);

// PATCH /api/applications/:id/status
router.patch('/:id/status', updateApplicationStatus);

// DELETE /api/applications/:id
router.delete('/:id', deleteApplication);

module.exports = router;
