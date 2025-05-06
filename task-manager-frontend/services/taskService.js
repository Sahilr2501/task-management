import api from './api';

export const getTasks = async () => {
    try {
        const res = await api.get('/tasks');
        return res.data;
    } catch (err) {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Authentication required. Please log in.');
        }
        console.error("Failed to fetch tasks:", err);
        throw new Error(err.response?.data?.message || 'Failed to fetch tasks');
    }
};

export const createTask = async (taskData) => {
    try {
        // Validate required fields
        if (!taskData.title) {
            throw new Error('Title is required');
        }
        if (!taskData.dueDate) {
            throw new Error('Due date is required');
        }

        // Format the data to match the backend schema
        const formattedData = {
            title: taskData.title.trim(),
            description: taskData.description?.trim() || '',
            dueDate: new Date(taskData.dueDate).toISOString(),
            priority: taskData.priority || 'Medium',
            status: taskData.status || 'To Do'
        };

        const res = await api.post('/tasks', formattedData);
        return res.data;
    } catch (err) {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Authentication required. Please log in.');
        }
        console.error("Failed to create task:", err);
        throw new Error(err.response?.data?.message || 'Failed to create task');
    }
};

export const updateTask = async (taskId, taskData) => {
    try {
        // Validate required fields
        if (!taskData.title) {
            throw new Error('Title is required');
        }
        if (!taskData.dueDate) {
            throw new Error('Due date is required');
        }

        // Format the data to match the backend schema
        const formattedData = {
            title: taskData.title.trim(),
            description: taskData.description?.trim() || '',
            dueDate: new Date(taskData.dueDate).toISOString(),
            priority: taskData.priority || 'Medium',
            status: taskData.status || 'To Do'
        };

        const res = await api.put(`/tasks/${taskId}`, formattedData);
        return res.data;
    } catch (err) {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Authentication required. Please log in.');
        }
        console.error("Failed to update task:", err);
        throw new Error(err.response?.data?.message || 'Failed to update task');
    }
};

export const deleteTask = async (taskId) => {
    try {
        await api.delete(`/tasks/${taskId}`);
    } catch (err) {
        if (err.response?.status === 401) {
            localStorage.removeItem('token');
            throw new Error('Authentication required. Please log in.');
        }
        console.error("Failed to delete task:", err);
        throw new Error(err.response?.data?.message || 'Failed to delete task');
    }
};
