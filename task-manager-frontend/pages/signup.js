import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/compat/router';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import Modal from '../components/Modal';
import api from '../services/api';
import dynamic from 'next/dynamic';

const SignupComponent = () => {
    const router = useRouter();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsModalOpen(true);
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            setIsModalOpen(true);
            return;
        }

        setIsLoading(true);

        try {
            // Use our API service instead of fetch
            const response = await api.post('/users/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            // If registration is successful, log the user in
            await login(formData.email, formData.password);
            router.push('/dashboard');
        } catch (error) {
            console.error('Signup error:', error);
            setError(error.response?.data?.message || error.message || 'Something went wrong');
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#DCA06D]">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#210F37]">Create Account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#210F37]">
                            Full Name
                        </label>
                        <div className="mt-1">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-[#4F1C51] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#210F37] focus:border-[#210F37]"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#210F37]">
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-[#4F1C51] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#210F37] focus:border-[#210F37]"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#210F37]">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-[#4F1C51] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#210F37] focus:border-[#210F37]"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#210F37]">
                            Confirm Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-[#4F1C51] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#210F37] focus:border-[#210F37]"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-[#210F37] rounded-md shadow-sm text-sm font-medium text-[#210F37] bg-[#DCA06D] hover:bg-[#4F1C51] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#210F37] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-center text-sm text-[#4F1C51]">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-[#210F37] hover:text-[#A55B4B]">
                        Sign in
                    </Link>
                </p>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                message={error}
            />
        </div>
    );
};

// Export with no SSR
export default dynamic(() => Promise.resolve(SignupComponent), {
    ssr: false
}); 