import { useState, useEffect } from 'react';
import { useRouter } from 'next/compat/router';
import api from '../services/api';
import dynamic from 'next/dynamic';

const RegisterComponent = () => {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/users/register', form);
        router.push('/login');
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
                <input name="name" className="input" type="text" placeholder="Name" onChange={handleChange} required />
                <input name="email" className="input mt-2" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" className="input mt-2" type="password" placeholder="Password" onChange={handleChange} required />
                <button className="btn mt-4 w-full">Register</button>
            </form>
        </div>
    );
};

// Export with no SSR
export default dynamic(() => Promise.resolve(RegisterComponent), {
    ssr: false
});
