const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, default: 'info' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String, default: '' },
  read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.methods.toPublicJSON = function () {
  return {
    id: this._id.toString(),
    recipientId: this.recipientId.toString(),
    type: this.type,
    title: this.title,
    message: this.message,
    link: this.link,
    read: this.read,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Notification', notificationSchema);
