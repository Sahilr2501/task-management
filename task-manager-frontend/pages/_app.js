import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import dynamic from 'next/dynamic';

// Dynamically import Navbar with no SSR
const Navbar = dynamic(() => import('../components/Navbar'), {
    ssr: false
});

function MyApp({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Navbar />
            <Component {...pageProps} />
        </AuthProvider>
    );
}

export default MyApp;
