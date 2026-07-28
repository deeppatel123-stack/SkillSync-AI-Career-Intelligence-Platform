const Task = require('../models/Task');

async function getTasks(req, res) {
  try {
    const { filter } = req.query;
    let query = {};
    if (filter === 'completed') query.completed = true;
    if (filter === 'incomplete') query.completed = false;
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json({ success: true, tasks: tasks.map((t) => t.toJSON()) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function createTask(req, res) {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ success: false, message: 'Title is required' });
    const task = await Task.create({ title: title.trim() });
    res.status(201).json({ success: true, task: task.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function toggleTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, task: task.toJSON() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getTasks, createTask, toggleTask, deleteTask };
