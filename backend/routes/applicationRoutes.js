const express = require('express');
const { getApplications, getApplicationById, createApplication, updateApplicationStatus, deleteApplication } = require('../controllers/applicationController');
const { requireAuth, requireStudent } = require('../middleware/authMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(requireAuth);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.post('/', requireStudent, uploadResume.single('resume'), createApplication);
router.patch('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

module.exports = router;
