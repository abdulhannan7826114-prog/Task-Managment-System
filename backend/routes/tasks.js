import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// CREATE - POST /api/tasks
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      userId: req.userId,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - GET /api/tasks
router.get('/', protect, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - GET /api/tasks/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to access this task' });
    }

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE - PUT /api/tasks/:id
router.put('/:id', protect, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const { title, description, status, priority, dueDate } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;

    task = await task.save();

    res.status(200).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - DELETE /api/tasks/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
