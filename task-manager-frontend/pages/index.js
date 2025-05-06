import { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
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
