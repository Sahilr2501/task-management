import { useState, useContext } from 'react';
import { createTask } from '../services/taskService';
import { AuthContext } from '../context/AuthContext';

export default function TaskForm({ onTaskCreated }) {
    const { user } = useContext(AuthContext);
    const [form, setForm] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        status: 'To Do',
        assignedTo: user?._id || ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError(''); // Clear error when user makes changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validate required fields
            if (!form.title.trim()) {
                throw new Error('Title is required');
            }
            if (!form.dueDate) {
                throw new Error('Due date is required');
            }

            // Format the date to ISO string and ensure it's valid
            const dueDate = new Date(form.dueDate);
            if (isNaN(dueDate.getTime())) {
                throw new Error('Invalid date format');
            }

            // Create the task data object, excluding empty assignedTo
            const formattedData = {
                title: form.title.trim(),
                description: form.description.trim(),
                dueDate: dueDate.toISOString(),
                priority: form.priority,
                status: form.status
            };

            // Only add assignedTo if it's not empty
            if (form.assignedTo && form.assignedTo.trim() !== '') {
                formattedData.assignedTo = form.assignedTo;
            }

            const newTask = await createTask(formattedData);
            onTaskCreated(newTask);
            setForm({
                title: '',
                description: '',
                dueDate: '',
                priority: 'Medium',
                status: 'To Do',
                assignedTo: user?._id || ''
            });
        } catch (error) {
            console.error('Task creation error:', error);
            setError(error.message || 'Failed to create task. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-white">Create New Task</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-900 text-red-100 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task title"
                        value={form.title}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-1">
                            Due Date *
                        </label>
                        <input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                            required
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.dueDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-300 mb-1">
                            Priority
                        </label>
                        <select
                            id="priority"
                            name="priority"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.priority}
                            onChange={handleChange}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows="3"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter task description"
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 rounded text-white font-medium ${isLoading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isLoading ? 'Creating...' : 'Create Task'}
                </button>
            </form>
        </div>
    );
}
