import dynamic from 'next/dynamic';

const LoginPage = () => {
    const { useState, useContext } = require('react');
    const { useRouter } = require('next/router');
    const { AuthContext } = require('../context/AuthContext');
    const Link = require('next/link').default;
    const Modal = require('../components/Modal').default;

    function Login() {
        const { login } = useContext(AuthContext);
        const [formData, setFormData] = useState({
            email: '',
            password: ''
        });
        const [error, setError] = useState('');
        const [isLoading, setIsLoading] = useState(false);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const router = useRouter();

        const handleChange = (e) => {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setError('');
            setIsLoading(true);

            // Validate form
            if (!formData.email || !formData.password) {
                setError('Please fill in all fields');
                setIsModalOpen(true);
                setIsLoading(false);
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                setError('Please enter a valid email address');
                setIsModalOpen(true);
                setIsLoading(false);
                return;
            }

            try {
                await login(formData.email.trim(), formData.password);
                router.push('/dashboard');
            } catch (error) {
                console.error('Login error:', error);
                setError(error.message || 'An error occurred during login');
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

    return <Login />;
};

export default dynamic(() => Promise.resolve(LoginPage), {
    ssr: false
});
