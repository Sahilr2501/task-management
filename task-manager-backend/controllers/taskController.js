import Task from '../models/Task.js';

export const createTask = async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (!req.body.dueDate) {
            return res.status(400).json({ message: 'Due date is required' });
        }

        // Create task with user ID
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description || '',
            dueDate: new Date(req.body.dueDate),
            priority: req.body.priority || 'Medium',
            status: req.body.status || 'To Do',
            createdBy: req.user._id
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Task creation error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error creating task' });
    }
};

export const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

export const getCreatedTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ createdBy: req.user._id });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching created tasks:', error);
        res.status(500).json({ message: 'Error fetching created tasks' });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            $or: [
                { createdBy: req.user._id },
                { assignedTo: req.user._id }
            ]
        }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching all tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user is authorized to update the task
        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this task' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error updating task' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user is authorized to delete the task
        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this task' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
};
