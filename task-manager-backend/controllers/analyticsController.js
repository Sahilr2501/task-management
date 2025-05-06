const Task = require('../models/Task');
const User = require('../models/User');

const getTaskAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        // Base query - adjust based on user role
        let query = {};
        if (userRole === 'user') {
            query = { assignedTo: userId };
        } else if (userRole === 'manager') {
            // Get tasks for manager's team
            const teamMembers = await User.find({ managerId: userId }).select('_id');
            query = { assignedTo: { $in: teamMembers.map(member => member._id) } };
        }

        // Get task completion rates
        const totalTasks = await Task.countDocuments(query);
        const completedTasks = await Task.countDocuments({ ...query, status: 'Completed' });
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        // Get overdue tasks
        const now = new Date();
        const overdueTasks = await Task.countDocuments({
            ...query,
            dueDate: { $lt: now },
            status: { $ne: 'Completed' }
        });

        // Get tasks by priority
        const priorityDistribution = await Task.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get tasks by status
        const statusDistribution = await Task.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get recent activity
        const recentActivity = await Task.find(query)
            .sort({ updatedAt: -1 })
            .limit(5)
            .populate('assignedTo', 'name')
            .populate('createdBy', 'name');

        // Get user performance metrics (for managers and admins)
        let userPerformance = [];
        if (userRole !== 'user') {
            userPerformance = await Task.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$assignedTo',
                        totalTasks: { $sum: 1 },
                        completedTasks: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
                            }
                        },
                        overdueTasks: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $lt: ['$dueDate', now] },
                                            { $ne: ['$status', 'Completed'] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: { $arrayElemAt: ['$userDetails.name', 0] },
                        totalTasks: 1,
                        completedTasks: 1,
                        overdueTasks: 1,
                        completionRate: {
                            $multiply: [
                                { $divide: ['$completedTasks', '$totalTasks'] },
                                100
                            ]
                        }
                    }
                }
            ]);
        }

        res.json({
            completionRate,
            overdueTasks,
            priorityDistribution,
            statusDistribution,
            recentActivity,
            userPerformance,
            totalTasks,
            completedTasks
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Error fetching analytics data' });
    }
};

module.exports = {
    getTaskAnalytics
}; 