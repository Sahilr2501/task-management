import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Analytics() {
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
        tasksByPriority: {},
        tasksByStatus: {},
        teamPerformance: [],
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics');
                setStats(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load analytics data');
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#DCA06D] p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-[#4F1C51] rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-[#210F37] rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#DCA06D] p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-[#A55B4B] text-white p-4 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#DCA06D] p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-[#210F37] mb-8">Analytics Dashboard</h1>

                {/* Task Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-[#4F1C51] mb-2">Total Tasks</h3>
                        <p className="text-3xl font-bold text-[#210F37]">{stats.totalTasks}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-[#4F1C51] mb-2">Completed</h3>
                        <p className="text-3xl font-bold text-[#210F37]">{stats.completedTasks}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-[#4F1C51] mb-2">Pending</h3>
                        <p className="text-3xl font-bold text-[#210F37]">{stats.pendingTasks}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-[#4F1C51] mb-2">Overdue</h3>
                        <p className="text-3xl font-bold text-[#210F37]">{stats.overdueTasks}</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Tasks by Priority */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-[#210F37] mb-4">Tasks by Priority</h3>
                        <div className="space-y-4">
                            {Object.entries(stats.tasksByPriority).map(([priority, count]) => (
                                <div key={priority} className="flex items-center">
                                    <div className="w-32 text-[#4F1C51]">{priority}</div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-[#DCA06D] rounded-full">
                                            <div
                                                className="h-4 bg-[#210F37] rounded-full"
                                                style={{ width: `${(count / stats.totalTasks) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-16 text-right text-[#4F1C51]">{count}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tasks by Status */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-[#210F37] mb-4">Tasks by Status</h3>
                        <div className="space-y-4">
                            {Object.entries(stats.tasksByStatus).map(([status, count]) => (
                                <div key={status} className="flex items-center">
                                    <div className="w-32 text-[#4F1C51]">{status}</div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-[#DCA06D] rounded-full">
                                            <div
                                                className="h-4 bg-[#210F37] rounded-full"
                                                style={{ width: `${(count / stats.totalTasks) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="w-16 text-right text-[#4F1C51]">{count}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Team Performance */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold text-[#210F37] mb-4">Team Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-[#210F37] text-white">
                                    <th className="px-6 py-3 text-left">Team Member</th>
                                    <th className="px-6 py-3 text-left">Tasks Completed</th>
                                    <th className="px-6 py-3 text-left">On-Time Rate</th>
                                    <th className="px-6 py-3 text-left">Average Completion Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.teamPerformance.map((member, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-[#DCA06D]' : 'bg-white'}>
                                        <td className="px-6 py-4 text-[#210F37]">{member.name}</td>
                                        <td className="px-6 py-4 text-[#4F1C51]">{member.completedTasks}</td>
                                        <td className="px-6 py-4 text-[#4F1C51]">{member.onTimeRate}%</td>
                                        <td className="px-6 py-4 text-[#4F1C51]">{member.avgCompletionTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-[#210F37] mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {stats.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className="w-2 h-2 mt-2 rounded-full bg-[#210F37]"></div>
                                <div>
                                    <p className="text-[#4F1C51]">{activity.description}</p>
                                    <p className="text-sm text-gray-500">{activity.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 