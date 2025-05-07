import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/compat/router';
import { AuthContext } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';

const Dashboard = () => {
    const router = useRouter();
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState({
        assignedTasks: [],
        createdTasks: [],
        overdueTasks: []
    });
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        priority: '',
        dueDate: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [activeTab, setActiveTab] = useState('assigned');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchTasks();
    }, [user, filters]);

    const fetchTasks = async () => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const data = await getTasks(queryParams);
            setTasks(data);
        } catch (error) {
            if (error.message === 'Authentication required. Please log in.') {
                logout();
                router.push('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleTaskCreated = (newTask) => {
        setTasks(prev => ({
            ...prev,
            createdTasks: [newTask, ...prev.createdTasks]
        }));
        setShowCreateForm(false);
    };

    const handleUpdateTask = async (taskId, updates) => {
        try {
            const updatedTask = await updateTask(taskId, updates);
            setTasks(prev => ({
                assignedTasks: prev.assignedTasks.map(task =>
                    task._id === taskId ? updatedTask : task
                ),
                createdTasks: prev.createdTasks.map(task =>
                    task._id === taskId ? updatedTask : task
                ),
                overdueTasks: prev.overdueTasks.map(task =>
                    task._id === taskId ? updatedTask : task
                )
            }));
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
            setTasks(prev => ({
                assignedTasks: prev.assignedTasks.filter(task => task._id !== taskId),
                createdTasks: prev.createdTasks.filter(task => task._id !== taskId),
                overdueTasks: prev.overdueTasks.filter(task => task._id !== taskId)
            }));
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchQuery }));
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Task Manager</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                        <button
                            onClick={logout}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Actions Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <form onSubmit={handleSearch} className="w-full md:w-96">
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                <button
                                    type="submit"
                                    className="h-full py-0 px-4 border-transparent bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>

                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        New Task
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white shadow rounded-lg p-4 mb-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-3">Filters</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                id="status"
                                name="status"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={filters.status}
                                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="">All Statuses</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={filters.priority}
                                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                            >
                                <option value="">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                value={filters.dueDate}
                                onChange={(e) => setFilters(prev => ({ ...prev, dueDate: e.target.value }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Create Task Modal */}
                <Modal isOpen={showCreateForm} onClose={() => setShowCreateForm(false)}>
                    <div className="p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Task</h2>
                        <TaskForm onTaskCreated={handleTaskCreated} />
                    </div>
                </Modal>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('assigned')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'assigned'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Assigned to Me
                            {tasks.assignedTasks.length > 0 && (
                                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {tasks.assignedTasks.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('created')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'created'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Created by Me
                            {tasks.createdTasks.length > 0 && (
                                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {tasks.createdTasks.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('overdue')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overdue'
                                ? 'border-red-500 text-red-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Overdue
                            {tasks.overdueTasks.length > 0 && (
                                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {tasks.overdueTasks.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                {/* Task Lists */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activeTab === 'assigned' && (
                            <TaskList
                                tasks={tasks.assignedTasks}
                                onUpdate={handleUpdateTask}
                                onDelete={handleDeleteTask}
                                emptyMessage="No tasks assigned to you yet."
                            />
                        )}
                        {activeTab === 'created' && (
                            <TaskList
                                tasks={tasks.createdTasks}
                                onUpdate={handleUpdateTask}
                                onDelete={handleDeleteTask}
                                isCreator
                                emptyMessage="You haven't created any tasks yet."
                            />
                        )}
                        {activeTab === 'overdue' && (
                            <TaskList
                                tasks={tasks.overdueTasks}
                                onUpdate={handleUpdateTask}
                                onDelete={handleDeleteTask}
                                isOverdue
                                emptyMessage="No overdue tasks. Great job!"
                            />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

// Task List Component
const TaskList = ({ tasks, onUpdate, onDelete, isCreator, isOverdue, emptyMessage }) => {
    if (tasks.length === 0) {
        return (
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No tasks found</h3>
                    <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map(task => (
                <TaskCard
                    key={task._id}
                    task={task}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    isCreator={isCreator}
                    isOverdue={isOverdue}
                />
            ))}
        </div>
    );
};

// Task Card Component
const TaskCard = ({ task, onUpdate, onDelete, isCreator, isOverdue }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task);

    const handleUpdate = async () => {
        await onUpdate(task._id, editedTask);
        setIsEditing(false);
    };

    const priorityColors = {
        High: 'bg-red-100 text-red-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Low: 'bg-green-100 text-green-800'
    };

    const statusColors = {
        'To Do': 'bg-gray-100 text-gray-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        'Completed': 'bg-green-100 text-green-800'
    };

    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isDueSoon = dueDate > today && dueDate < new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

    return (
        <div className={`bg-white overflow-hidden shadow rounded-lg ${isOverdue ? 'border-l-4 border-red-500' : isDueSoon ? 'border-l-4 border-yellow-500' : ''}`}>
            <div className="px-4 py-5 sm:p-6">
                {isEditing ? (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                type="text"
                                id="title"
                                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                value={editedTask.title}
                                onChange={(e) => setEditedTask(prev => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                rows={3}
                                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                value={editedTask.description}
                                onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                                <input
                                    type="date"
                                    id="dueDate"
                                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                                    value={editedTask.dueDate.split('T')[0]}
                                    onChange={(e) => setEditedTask(prev => ({ ...prev, dueDate: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                                <select
                                    id="priority"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={editedTask.priority}
                                    onChange={(e) => setEditedTask(prev => ({ ...prev, priority: e.target.value }))}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    id="status"
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    value={editedTask.status}
                                    onChange={(e) => setEditedTask(prev => ({ ...prev, status: e.target.value }))}
                                >
                                    <option value="To Do">To Do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={handleUpdate}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 line-clamp-2">{task.title}</h3>
                            {isCreator && (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                        title="Edit task"
                                    >
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => onDelete(task._id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Delete task"
                                    >
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 line-clamp-3">{task.description}</p>
                        </div>
                        <div className="mt-4">
                            <div className="flex items-center text-sm text-gray-500">
                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span>
                                    Due: {dueDate.toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                                {isOverdue && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Overdue
                                    </span>
                                )}
                                {isDueSoon && !isOverdue && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Due Soon
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                                {task.priority} Priority
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                                {task.status}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;