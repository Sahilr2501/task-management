import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const errorMessage = error.response.data?.message || 'An error occurred';
            console.error('Response Error:', {
                status: error.response.status,
                message: errorMessage,
                data: error.response.data
            });
            return Promise.reject(new Error(errorMessage));
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request Error:', error.request);
            return Promise.reject(new Error('No response from server'));
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error.message);
            return Promise.reject(error);
        }
    }
);

// Auth API calls
export const register = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/users/login', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getProfile = async () => {
    try {
        const response = await api.get('/users/profile');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateProfile = async (userData) => {
    try {
        const response = await api.put('/users/profile', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Task API calls
export const getTasks = async (queryParams = '') => {
    try {
        const response = await api.get(`/tasks?${queryParams}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTask = async (taskData) => {
    try {
        const response = await api.post('/tasks', taskData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTask = async (taskId, taskData) => {
    try {
        const response = await api.put(`/tasks/${taskId}`, taskData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTask = async (taskId) => {
    try {
        await api.delete(`/tasks/${taskId}`);
    } catch (error) {
        throw error;
    }
};

export const markNotificationAsRead = async (taskId, notificationId) => {
    try {
        await api.put(`/tasks/${taskId}/notifications/${notificationId}/read`);
    } catch (error) {
        throw error;
    }
};

export default api;
