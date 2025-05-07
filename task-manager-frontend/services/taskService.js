import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://task-management-backend-m1qu.onrender.com/api';

// Get all tasks with filtering
export const getTasks = async (queryParams = '') => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required. Please log in.');
        }

        const response = await axios.get(`${API_URL}/tasks?${queryParams}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Authentication required. Please log in.');
        }
        throw error;
    }
};

// Create a new task
export const createTask = async (taskData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required. Please log in.');
        }

        const response = await axios.post(`${API_URL}/tasks`, taskData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Authentication required. Please log in.');
        }

        // Handle validation errors
        if (error.response?.status === 400) {
            const errorMessage = error.response.data.message;
            if (error.response.data.errors) {
                throw new Error(error.response.data.errors.join(', '));
            }
            throw new Error(errorMessage || 'Invalid task data');
        }

        // Handle other errors
        throw new Error(error.response?.data?.message || 'Failed to create task. Please try again.');
    }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required. Please log in.');
        }

        const response = await axios.put(`${API_URL}/tasks/${taskId}`, taskData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Authentication required. Please log in.');
        }
        throw error;
    }
};

// Delete a task
export const deleteTask = async (taskId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required. Please log in.');
        }

        await axios.delete(`${API_URL}/tasks/${taskId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Authentication required. Please log in.');
        }
        throw error;
    }
};

// Mark notification as read
export const markNotificationAsRead = async (taskId, notificationId) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Authentication required. Please log in.');
        }

        await axios.put(
            `${API_URL}/tasks/${taskId}/notifications/${notificationId}/read`,
            {},
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error('Authentication required. Please log in.');
        }
        throw error;
    }
};
