import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import Modal from '../components/Modal';

export default function Login() {
    const { login } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            router.push('/dashboard');
        } catch (error) {
            setError(error.message);
            setIsModalOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#DCA06D]">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#210F37]">Sign In</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#210F37]">
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                type="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-[#4F1C51] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#210F37] focus:border-[#210F37]"
                                placeholder="Enter your email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
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
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-[#4F1C51] rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#210F37] focus:border-[#210F37]"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-[#210F37] rounded-md shadow-sm text-sm font-medium text-[#210F37] bg-[#DCA06D] hover:bg-[#4F1C51] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#210F37] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>

                <p className="mt-4 text-center text-sm text-[#4F1C51]">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-medium text-[#210F37] hover:text-[#A55B4B]">
                        Sign up
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
}
