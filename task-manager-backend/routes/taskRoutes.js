import express from 'express';
import {
    createTask, getMyTasks, getCreatedTasks, getAllTasks,
    updateTask, deleteTask
} from '../controllers/taskController.js';
import protect from '../middleware/auth.js';

const router = express.Router();
router.use(protect);
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/assigned', getMyTasks);
router.get('/created', getCreatedTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;
