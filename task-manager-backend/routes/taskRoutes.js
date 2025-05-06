const express = require('express');
const {
    createTask, getMyTasks, getCreatedTasks, getAllTasks,
    updateTask, deleteTask
} = require('../controllers/taskController.js');
const protect = require('../middleware/auth.js'); // ✅ FIXED

const router = express.Router();
router.use(protect);
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/assigned', getMyTasks);
router.get('/created', getCreatedTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
