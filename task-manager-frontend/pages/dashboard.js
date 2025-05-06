import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { AuthContext } from '../context/AuthContext';
import { getTasks, createTask } from '../services/taskService';

export default function Dashboard() {
    const router = useRouter();
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        async function fetchTasks() {
            try {
                setError(null);
                setIsLoading(true);
                const data = await getTasks();
                setTasks(data);
            } catch (error) {
                if (error.message === 'Authentication required. Please log in.') {
                    logout();
                    router.push('/login');
                } else {
                    setError('Failed to fetch tasks. Please try again later.');
                }
                console.error("Failed to fetch tasks:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTasks();
    }, [user, router, logout]);

    const handleTaskCreate = async (taskData) => {
        try {
            setError(null);
            const newTask = await createTask(taskData);
            setTasks(prev => [newTask, ...prev]);
            setIsFormOpen(false);
        } catch (error) {
            if (error.message === 'Authentication required. Please log in.') {
                logout();
                router.push('/login');
            } else {
                setError('Failed to create task. Please try again later.');
            }
            console.error("Task creation failed:", error);
        }
    };

    const handleTaskUpdate = (updatedTask) => {
        setTasks(prev => prev.map(task =>
            task._id === updatedTask._id ? updatedTask : task
        ));
    };

    const handleTaskDelete = (taskId) => {
        setTasks(prev => prev.filter(task => task._id !== taskId));
    };

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-[#DCA06D]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#210F37] mb-4 sm:mb-0">
                            Welcome, {user?.name || 'Guest'}
                        </h1>
                        <button
                            onClick={() => setIsFormOpen(!isFormOpen)}
                            className="w-full sm:w-auto bg-[#210F37] text-white px-4 py-2 rounded-md hover:bg-[#4F1C51] focus:outline-none focus:ring-2 focus:ring-[#210F37] focus:ring-offset-2"
                        >
                            {isFormOpen ? 'Cancel' : 'Add New Task'}
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-[#A55B4B] border border-[#4F1C51] text-white rounded">
                            {error}
                        </div>
                    )}

                    {isFormOpen && (
                        <div className="mb-6">
                            <TaskForm onTaskCreated={handleTaskCreate} />
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#210F37]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {tasks.map(task => (
                                <TaskCard
                                    key={task._id}
                                    task={task}
                                    onTaskUpdate={handleTaskUpdate}
                                    onTaskDelete={handleTaskDelete}
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading && tasks.length === 0 && !error && (
                        <p className="text-center text-[#4F1C51] mt-6">
                            No tasks available. Start by adding a new task!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
