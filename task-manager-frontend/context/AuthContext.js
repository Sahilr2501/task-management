import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setUser(null);
                    setLoading(false);
                    return;
                }
                const res = await api.get('/users/profile');
                setUser(res.data);
            } catch (error) {
                console.error('Profile fetch error:', error);
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/users/login', { email, password });
            const { token, user: userData } = res.data;
            localStorage.setItem('token', token);
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        throw new Error('Invalid email or password');
                    case 404:
                        throw new Error('Login service not found. Please check server configuration.');
                    case 500:
                        throw new Error('Server error. Please try again later.');
                    default:
                        throw new Error(error.response.data?.message || 'Login failed. Please try again.');
                }
            } else if (error.request) {
                throw new Error('No response from server. Please check your connection.');
            } else {
                throw new Error('Login failed. Please try again.');
            }
        }
    };

    const logout = () => {
        // Clear client-side data
        localStorage.removeItem('token');
        setUser(null);

        // Clear any cached API data
        api.defaults.headers.common['Authorization'] = '';

        // Clear any other client-side storage if needed
        sessionStorage.clear();

        // Clear any cached data in memory
        if (window.caches) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    caches.delete(cacheName);
                });
            });
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
