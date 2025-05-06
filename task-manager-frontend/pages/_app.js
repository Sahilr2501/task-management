import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import dynamic from 'next/dynamic';

// Dynamically import Navbar with no SSR
const Navbar = dynamic(() => import('../components/Navbar'), {
    ssr: false
});

export default function App({ Component, pageProps }) {
    return (
        <AuthProvider>
            <Navbar />
            <Component {...pageProps} />
        </AuthProvider>
    );
}
