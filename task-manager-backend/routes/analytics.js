const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Get analytics data
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const userId = req.user.id;
        const isUserAdmin = req.user.role === 'admin';

        // Get tasks based on user role
        const taskQuery = isUserAdmin ? {} : { assignedTo: userId };
        const tasks = await Task.find(taskQuery);

        // Calculate task statistics
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.status === 'completed').length;
        const pendingTasks = tasks.filter(task => task.status !== 'completed').length;
        const overdueTasks = tasks.filter(task =>
            task.status !== 'completed' && new Date(task.dueDate) < new Date()
        ).length;

        // Tasks by priority
        const tasksByPriority = tasks.reduce((acc, task) => {
            acc[task.priority] = (acc[task.priority] || 0) + 1;
            return acc;
        }, {});

        // Tasks by status
        const tasksByStatus = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});

        // Team performance metrics
        const teamMembers = await User.find({ role: { $ne: 'admin' } });
        const teamPerformance = await Promise.all(teamMembers.map(async (member) => {
            const memberTasks = await Task.find({ assignedTo: member._id });
            const completedMemberTasks = memberTasks.filter(task => task.status === 'completed');
            const onTimeTasks = completedMemberTasks.filter(task =>
                new Date(task.completedAt) <= new Date(task.dueDate)
            );

            return {
                name: member.name,
                completedTasks: completedMemberTasks.length,
                onTimeRate: memberTasks.length ?
                    Math.round((onTimeTasks.length / completedMemberTasks.length) * 100) : 0,
                avgCompletionTime: completedMemberTasks.length ?
                    calculateAverageCompletionTime(completedMemberTasks) : 'N/A'
            };
        }));

        // Recent activity
        const recentActivity = await Task.find()
            .sort({ updatedAt: -1 })
            .limit(10)
            .populate('assignedTo', 'name')
            .map(task => ({
                description: `${task.assignedTo.name} ${task.status === 'completed' ? 'completed' : 'updated'} task: ${task.title}`,
                timestamp: task.updatedAt
            }));

        res.json({
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            tasksByPriority,
            tasksByStatus,
            teamPerformance,
            recentActivity
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Error fetching analytics data' });
    }
});

// Helper function to calculate average completion time
function calculateAverageCompletionTime(completedTasks) {
    const totalTime = completedTasks.reduce((acc, task) => {
        const startTime = new Date(task.createdAt);
        const endTime = new Date(task.completedAt);
        return acc + (endTime - startTime);
    }, 0);

    const avgTimeInDays = totalTime / (completedTasks.length * 24 * 60 * 60 * 1000);
    return avgTimeInDays.toFixed(1) + ' days';
}

module.exports = router; 