import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
    const token = localStorage.getItem("token");

    const [counts, setCounts] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0
    });

    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);

    const [userFilters, setUserFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: ""
    });

    const [storeFilters, setStoreFilters] = useState({
        name: "",
        email: "",
        address: ""
    });

    const fetchCounts = async () => {
        const res = await axios.get(`${API}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setCounts(res.data);
    };

    const fetchUsers = async () => {
        const res = await axios.get(`${API}/admin/users`, {
            params: userFilters,
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
    };

    const fetchStores = async () => {
        const res = await axios.get(`${API}/admin/stores`, {
            params: storeFilters,
            headers: { Authorization: `Bearer ${token}` }
        });
        setStores(res.data);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCounts();
        fetchUsers();
        fetchStores();
    }, []);

    return (
        <div className="space-y-8">
            <h1 className="text-xl font-semibold text-slate-50">Admin Dashboard</h1>

            {/* COUNT CARDS */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 shadow">
                    <h2 className="text-lg font-medium">Total Users</h2>
                    <p className="text-3xl text-indigo-400">{counts.totalUsers}</p>
                </div>
                <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 shadow">
                    <h2 className="text-lg font-medium">Total Stores</h2>
                    <p className="text-3xl text-indigo-400">{counts.totalStores}</p>
                </div>
                <div className="p-5 bg-slate-900/60 rounded-xl border border-slate-800 shadow">
                    <h2 className="text-lg font-medium">Total Ratings</h2>
                    <p className="text-3xl text-indigo-400">{counts.totalRatings}</p>
                </div>
            </div>

            {/* USERS TABLE */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-200">Users</h2>

                {/* FILTERS */}
                <div className="flex flex-wrap gap-3">
                    <input
                        className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-md"
                        placeholder="Search name"
                        value={userFilters.name}
                        onChange={(e) => setUserFilters((f) => ({ ...f, name: e.target.value }))}
                    />
                    <input
                        className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-md"
                        placeholder="Search email"
                        value={userFilters.email}
                        onChange={(e) => setUserFilters((f) => ({ ...f, email: e.target.value }))}
                    />
                    <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-indigo-500 rounded-md hover:bg-indigo-600"
                    >
                        Apply
                    </button>
                </div>

                <table className="w-full border border-slate-800 rounded-xl overflow-hidden text-sm">
                    <thead className="bg-slate-800/60">
                        <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Address</th>
                            <th className="p-2 text-left">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id} className="border-t border-slate-800">
                                <td className="p-2">{u.name}</td>
                                <td className="p-2">{u.email}</td>
                                <td className="p-2">{u.address}</td>
                                <td className="p-2 capitalize">{u.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* STORES TABLE */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-200">Stores</h2>

                <div className="flex flex-wrap gap-3">
                    <input
                        className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-md"
                        placeholder="Store name"
                        value={storeFilters.name}
                        onChange={(e) =>
                            setStoreFilters((f) => ({ ...f, name: e.target.value }))
                        }
                    />
                    <button
                        onClick={fetchStores}
                        className="px-4 py-2 bg-indigo-500 rounded-md hover:bg-indigo-600"
                    >
                        Apply
                    </button>
                </div>

                <table className="w-full border border-slate-800 rounded-xl overflow-hidden text-sm">
                    <thead className="bg-slate-800/60">
                        <tr>
                            <th className="p-2 text-left">Name</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Address</th>
                            <th className="p-2 text-left">Avg Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stores.map((s) => (
                            <tr key={s.id} className="border-t border-slate-800">
                                <td className="p-2">{s.name}</td>
                                <td className="p-2">{s.email}</td>
                                <td className="p-2">{s.address}</td>
                                <td className="p-2">{s.avg_rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
