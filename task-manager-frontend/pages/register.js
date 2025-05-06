import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post('/users/register', form);
        router.push('/login');
    };

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
}
