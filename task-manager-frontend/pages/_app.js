import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/compat/router';
import { useEffect, useState } from 'react';

// Dynamically import Navbar with no SSR
const Navbar = dynamic(() => import('../components/Navbar'), {
    ssr: false
});

function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        // Handle client-side navigation
        const handleRouteChange = (url) => {
            console.log('Route changed to:', url);
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router]);

    if (!isClient) {
        return null;
    }

    return (
        <AuthProvider>
            <Navbar />
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
