import React, { useState } from "react";
import axios from "axios";
import Input from "../components/Input.jsx";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;

const SignupPage = () => {
    const nav = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        address: "",
        password: ""
    });
    const [error, setError] = useState("");

    const change = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const validate = () => {
        if (form.name.length < 20 || form.name.length > 60)
            return "Name must be 20–60 characters";
        if (form.address.length > 400)
            return "Address max 400 chars";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            return "Invalid email";
        if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(form.password))
            return "Password 8–16 chars, 1 uppercase & 1 special char";
        return null;
    };

    const submit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (v) return setError(v);

        try {
            await axios.post(`${API}/auth/signup`, form);
            nav("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <section className="max-w-md mx-auto mt-10 space-y-4">
            <h1 className="text-2xl font-semibold text-slate-50">Create Account</h1>

            <form
                onSubmit={submit}
                className="space-y-4 bg-slate-900/50 rounded-xl p-6 border border-slate-800"
            >
                <Input label="Name" name="name" value={form.name} onChange={change} />
                <Input label="Email" name="email" type="email" value={form.email} onChange={change} />
                <Input label="Address" name="address" value={form.address} onChange={change} />
                <Input label="Password" name="password" type="password" value={form.password} onChange={change} />

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                    type="submit"
                    className="w-full py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-sm font-medium"
                >
                    Sign Up
                </button>
            </form>
        </section>
    );
};

export default SignupPage;
