import express from 'express';
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    markNotificationAsRead
} from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Task routes
router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Notification routes
router.put('/:id/notifications/:notificationId/read', markNotificationAsRead);

export default router;
