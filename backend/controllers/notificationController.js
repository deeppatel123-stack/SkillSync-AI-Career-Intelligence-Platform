const Notification = require('../models/Notification');

async function getNotifications(req, res) {
  try {
    const notifications = await Notification.find({ recipientId: req.user._id }).sort({ createdAt: -1 });
    const unreadCount = notifications.filter(n => !n.read).length;
    res.json({ success: true, notifications: notifications.map(n => n.toPublicJSON()), unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function markNotificationRead(req, res) {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
    if (notification.recipientId.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Not allowed' });
    notification.read = true;
    await notification.save();
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function markAllNotificationsRead(req, res) {
  try {
    await Notification.updateMany({ recipientId: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getNotifications, markNotificationRead, markAllNotificationsRead };
