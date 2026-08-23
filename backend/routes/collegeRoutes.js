const express = require('express');
const {
  getCollegeStats,
  getCollegeStudents,
  getCampusDrives,
  createCampusDrive,
  updateCampusDrive,
  deleteCampusDrive,
  registerForCampusDrive,
  getCollegeEvents,
  createCollegeEvent,
  deleteCollegeEvent,
} = require('../controllers/collegeController');
const { requireAuth, requireCollege, requireStudent } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.get('/stats', requireCollege, getCollegeStats);
router.get('/students', getCollegeStudents);

// Drives
router.get('/drives', getCampusDrives);
router.post('/drives', requireCollege, createCampusDrive);
router.put('/drives/:id', requireCollege, updateCampusDrive);
router.delete('/drives/:id', requireCollege, deleteCampusDrive);
router.post('/drives/:id/register', requireStudent, registerForCampusDrive);

// Events
router.get('/events', getCollegeEvents);
router.post('/events', requireCollege, createCollegeEvent);
router.delete('/events/:id', requireCollege, deleteCollegeEvent);

module.exports = router;
