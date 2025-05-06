import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // or your deployed URL
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // Enable sending cookies if needed
});

// Request interceptor
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token'); // or get it from context
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => {
        // Log successful response
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
        return response;
    },
    error => {
        // Log detailed error information
        console.error('Response Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers,
                data: error.config?.data
            }
        });

        if (error.response?.status === 401) {
            // Clear token on authentication error
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default api;
