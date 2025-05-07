import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/compat/router';
import { AuthContext } from '../context/AuthContext';
import { markNotificationAsRead } from '../services/taskService';

const Navbar = () => {
    const router = useRouter();
    const { user, logout } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (user) {
            // Fetch notifications when user is logged in
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/notifications`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleNotificationClick = async (taskId, notificationId) => {
        try {
            await markNotificationAsRead(taskId, notificationId);
            setNotifications(prev =>
                prev.filter(notification => notification._id !== notificationId)
            );
            router.push(`/dashboard?task=${taskId}`);
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!isClient) {
        return null;
    }

    return (
        <nav className="bg-gray-900 text-white p-4 border-b border-gray-700">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                        Task Manager
                    </Link>
                    {user && (
                        <>
                            <Link href="/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">
                                Dashboard
                            </Link>
                            {user.role === 'admin' && (
                                <Link href="/admin" className="text-gray-300 hover:text-blue-400 transition-colors">
                                    Admin
                                </Link>
                            )}
                        </>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="text-sm text-gray-300">
                                {user.name} ({user.role})
                            </span>
                            <button
                                onClick={logout}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

// Export a client-side only version of the Navbar
export default dynamic(() => Promise.resolve(Navbar), {
    ssr: false
});
