import React, { useState } from 'react';
import axios from 'axios';
import Input from '../components/Input.jsx';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const LoginPage = () => {
    const nav = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API}/auth/login`, form);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            if (res.data.user.role === 'admin') nav('/admin');
            else if (res.data.user.role === 'store_owner') nav('/owner');
            else nav('/stores');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <section className="max-w-md mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-semibold text-slate-50">Login</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-slate-900/50 rounded-xl p-6 border border-slate-800"
            >
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                />
                {error && <p className="text-sm text-red-400">{error}</p>}
                <button
                    type="submit"
                    className="w-full py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-sm font-medium"
                >
                    Log In
                </button>
            </form>
        </section>
    );
};

export default LoginPage;
