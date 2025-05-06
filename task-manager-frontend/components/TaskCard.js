import { useState } from 'react';
import { updateTask, deleteTask } from '../services/taskService';

export default function TaskCard({ task, onTaskUpdate, onTaskDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task);
    const [isLoading, setIsLoading] = useState(false);

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'bg-[#A55B4B] text-white';
            case 'medium':
                return 'bg-[#4F1C51] text-white';
            case 'low':
                return 'bg-[#DCA06D] text-[#210F37]';
            default:
                return 'bg-[#DCA06D] text-[#210F37]';
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-[#DCA06D] text-[#210F37]';
            case 'in progress':
                return 'bg-[#4F1C51] text-white';
            case 'to do':
                return 'bg-[#210F37] text-white';
            default:
                return 'bg-[#210F37] text-white';
        }
    };

    const handleUpdate = async () => {
        try {
            setIsLoading(true);
            const updatedTask = await updateTask(task._id, editedTask);
            onTaskUpdate(updatedTask);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                setIsLoading(true);
                await deleteTask(task._id);
                onTaskDelete(task._id);
            } catch (error) {
                console.error('Failed to delete task:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (isEditing) {
        return (
            <div className="bg-white p-4 rounded-lg shadow">
                <div className="space-y-4">
                    <input
                        type="text"
                        name="title"
                        value={editedTask.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#4F1C51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#210F37]"
                        placeholder="Task title"
                    />
                    <textarea
                        name="description"
                        value={editedTask.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#4F1C51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#210F37]"
                        placeholder="Task description"
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={new Date(editedTask.dueDate).toISOString().split('T')[0]}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#4F1C51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#210F37]"
                    />
                    <select
                        name="priority"
                        value={editedTask.priority}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#4F1C51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#210F37]"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <select
                        name="status"
                        value={editedTask.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-[#4F1C51] rounded-md focus:outline-none focus:ring-2 focus:ring-[#210F37]"
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleUpdate}
                            disabled={isLoading}
                            className="flex-1 bg-[#210F37] text-[#210F37] px-4 py-2 rounded-md hover:bg-[#4F1C51] hover:text-[#210F37] disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="flex-1 bg-[#DCA06D] text-[#210F37] px-4 py-2 rounded-md hover:bg-[#A55B4B] hover:text-[#210F37]"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-[#210F37]">{task.title}</h3>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-[#4F1C51] hover:text-[#A55B4B]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-[#A55B4B] hover:text-[#4F1C51]"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <p className="text-[#4F1C51] mb-4 flex-grow">{task.description}</p>

                <div className="space-y-2">
                    <div className="flex items-center text-sm text-[#A55B4B]">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(task.dueDate).toLocaleDateString()}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
