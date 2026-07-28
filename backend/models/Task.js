const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Task title is required'], trim: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

taskSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(), title: this.title, completed: this.completed,
    createdAt: this.createdAt, updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Task', taskSchema);
