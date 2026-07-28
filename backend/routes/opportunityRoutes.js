const express = require('express');
const { body } = require('express-validator');
const { getOpportunities, getOpportunityCount, getOpportunityById, createOpportunity, updateOpportunity, reviewOpportunity, deleteOpportunity, getDashboardStats } = require('../controllers/opportunityController');
const { requireAuth, requireOrganizer, requireAdmin } = require('../middleware/authMiddleware');
const { handleValidation } = require('../middleware/validateMiddleware');

const router = express.Router();

const createRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('type').isIn(['hackathon', 'internship', 'job', 'event']).withMessage('Invalid type'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('deadline').notEmpty().withMessage('Deadline is required'),
];

router.get('/count', getOpportunityCount);
router.get('/', getOpportunities);
router.get('/dashboard/stats', requireAuth, getDashboardStats);
router.get('/:id', getOpportunityById);
router.post('/', requireAuth, requireOrganizer, createRules, handleValidation, createOpportunity);
router.put('/:id', requireAuth, updateOpportunity);
router.patch('/:id/review', requireAuth, requireAdmin, reviewOpportunity);
router.delete('/:id', requireAuth, deleteOpportunity);

module.exports = router;
