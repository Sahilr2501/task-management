import dynamic from 'next/dynamic';

const HomePage = () => {
    const { useEffect, useContext } = require('react');
    const { useRouter } = require('next/router');
    const { AuthContext } = require('../context/AuthContext');

    function Home() {
        const router = useRouter();
        const { user } = useContext(AuthContext);

        useEffect(() => {
            if (user) {
                router.push('/dashboard');
            } else {
                router.push('/login');
            }
        }, [user, router]);

        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600">Redirecting...</p>
            </div>
        );
    }

    return <Home />;
};

export default dynamic(() => Promise.resolve(HomePage), {
    ssr: false
});
