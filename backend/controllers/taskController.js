import Task from '../models/Task.js';

export const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const task = new Task({
    title,
    description,
    status: status || 'Todo',
    priority: priority || 'Medium',
    dueDate,
    userId: req.user.id
  });

  await task.save();

  res.status(201).json({
    message: 'Task created successfully',
    task
  });
};

export const getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });

  res.status(200).json({
    count: tasks.length,
    tasks
  });
};

export const getTaskById = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (task.userId.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to access this task' });
  }

  res.status(200).json(task);
};

export const updateTask = async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (task.userId.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to update this task' });
  }

  const { title, description, status, priority, dueDate } = req.body;

  if (title) task.title = title;
  if (description !== undefined) task.description = description;
  if (status) task.status = status;
  if (priority) task.priority = priority;
  if (dueDate !== undefined) task.dueDate = dueDate;

  await task.save();

  res.status(200).json({
    message: 'Task updated successfully',
    task
  });
};

export const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (task.userId.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to delete this task' });
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: 'Task deleted successfully'
  });
};
