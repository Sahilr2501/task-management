import Task from '../models/Task.js';
import User from '../models/User.js';

// Get all tasks with filtering and search
export const getTasks = async (req, res) => {
    try {
        const {
            search,
            status,
            priority,
            dueDate,
            assignedTo,
            createdBy,
            overdue
        } = req.query;

        let query = {};

        // Search by title or description
        if (search) {
            query.$text = { $search: search };
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by priority
        if (priority) {
            query.priority = priority;
        }

        // Filter by due date
        if (dueDate) {
            const date = new Date(dueDate);
            query.dueDate = {
                $gte: new Date(date.setHours(0, 0, 0)),
                $lt: new Date(date.setHours(23, 59, 59))
            };
        }

        // Filter by assigned user
        if (assignedTo) {
            query.assignedTo = assignedTo;
        }

        // Filter by creator
        if (createdBy) {
            query.createdBy = createdBy;
        }

        // Get tasks assigned to current user
        const assignedTasks = await Task.find({
            ...query,
            assignedTo: req.user.id
        }).sort({ dueDate: 1 });

        // Get tasks created by current user
        const createdTasks = await Task.find({
            ...query,
            createdBy: req.user.id
        }).sort({ dueDate: 1 });

        // Get overdue tasks
        const overdueTasks = await Task.find({
            ...query,
            $or: [
                { assignedTo: req.user.id },
                { createdBy: req.user.id }
            ],
            status: { $ne: 'Completed' },
            dueDate: { $lt: new Date() }
        }).sort({ dueDate: 1 });

        res.json({
            assignedTasks,
            createdTasks,
            overdueTasks
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status, assignedTo } = req.body;

        // Input validation
        if (!title || !dueDate) {
            return res.status(400).json({ message: 'Title and due date are required' });
        }

        // Validate date format
        const parsedDate = new Date(dueDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Validate priority
        if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority value' });
        }

        // Validate status
        if (status && !['To Do', 'In Progress', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        // Create task
        const task = await Task.create({
            title,
            description,
            dueDate: parsedDate,
            priority: priority || 'Medium',
            status: status || 'To Do',
            createdBy: req.user.id,
            assignedTo
        });

        // Add notification for assigned user
        if (assignedTo) {
            try {
                await task.addNotification(
                    assignedTo,
                    `You have been assigned a new task: ${title}`
                );
            } catch (notificationError) {
                console.error('Error adding notification:', notificationError);
                // Don't fail the request if notification fails
            }
        }

        res.status(201).json(task);
    } catch (error) {
        console.error('Task creation error:', {
            message: error.message,
            stack: error.stack,
            body: req.body,
            user: req.user.id
        });

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Task with this title already exists' });
        }

        res.status(500).json({
            message: 'Error creating task',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update a task
export const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user is authorized to update the task
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { title, description, dueDate, priority, status, assignedTo } = req.body;

        // Update task fields
        if (title) task.title = title;
        if (description) task.description = description;
        if (dueDate) task.dueDate = new Date(dueDate);
        if (priority) task.priority = priority;
        if (status) task.status = status;

        // Handle assignment changes
        if (assignedTo && assignedTo !== task.assignedTo?.toString()) {
            task.assignedTo = assignedTo;
            await task.addNotification(
                assignedTo,
                `You have been assigned a new task: ${task.title}`
            );
        }

        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
};

// Delete a task
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if user is authorized to delete the task
        if (task.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const notification = task.notifications.id(req.params.notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.read = true;
        await task.save();

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification' });
    }
};
