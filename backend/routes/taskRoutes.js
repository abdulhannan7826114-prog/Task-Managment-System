import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/tasks', protect, createTask);
router.get('/tasks', protect, getTasks);
router.put('/tasks/:id', protect, updateTask);
router.delete('/tasks/:id', protect, deleteTask);

export default router;
