const express = require('express');
const { getNotifications, markNotificationRead, markAllNotificationsRead } = require('../controllers/notificationController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

// GET /api/notifications
router.get('/', getNotifications);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', markNotificationRead);

// POST /api/notifications/read-all
router.post('/read-all', markAllNotificationsRead);

module.exports = router;
