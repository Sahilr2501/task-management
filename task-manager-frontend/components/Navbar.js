import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { useRouter } from 'next/compat/router';
import { AuthContext } from '../context/AuthContext';

function NavbarComponent() {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            router.push('/login');
            setIsMenuOpen(false);
        }
    };

    return (
        <nav className="bg-primary text-white p-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <h1 className="font-bold text-lg">Task Manager</h1>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded hover:bg-[#4F1C51] focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link href="/dashboard" className="hover:text-[#DCA06D] transition-colors border border-white px-3 py-1 rounded-md">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="hover:text-[#DCA06D] transition-colors border border-white px-3 py-1 rounded-md"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="hover:text-[#DCA06D] transition-colors border border-white px-3 py-1 rounded-md">
                                Sign In
                            </Link>
                            <Link href="/signup" className="hover:text-[#DCA06D] transition-colors border border-white px-3 py-1 rounded-md">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-16 left-0 right-0 bg-primary p-4 space-y-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
                {user ? (
                    <>
                        <Link
                            href="/dashboard"
                            className="block py-2 hover:text-[#DCA06D] transition-colors border border-white px-3 py-1 rounded-md mb-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left py-2 hover:text-[#DCA06D] transition-colors border border-white px-3 py-1 rounded-md"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="block py-2 hover:text-[#DCA06D] transition-colors border border-white px-3 py-1 rounded-md mb-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="block py-2 hover:text-[#DCA06D] transition-colors border border-white px-3 py-1 rounded-md"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

// Export a client-side only version of the Navbar
export default dynamic(() => Promise.resolve(NavbarComponent), {
    ssr: false
});
