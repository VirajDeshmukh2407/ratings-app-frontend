import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const OwnerDashboard = () => {
    const token = localStorage.getItem("token");

    const [stores, setStores] = useState([]);
    const [averages, setAverages] = useState([]);
    const [ratings, setRatings] = useState([]);

    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState(null); // id of store being edited

    const [form, setForm] = useState({ name: "", address: "", email: "" });

    const fetchData = async () => {
        setLoading(true);
        const res = await axios.get(`${API}/owner/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setStores(res.data.stores);
        setRatings(res.data.ratings);
        setAverages(res.data.averages);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createStore = async () => {
        await axios.post(
            `${API}/owner/store`,
            form,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setCreating(false);
        fetchData();
    };

    const updateStore = async (storeId) => {
        await axios.put(
            `${API}/owner/store/${storeId}`,
            form,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditing(null);
        fetchData();
    };

    const deleteStore = async (storeId) => {
        if (!window.confirm("Delete this store?")) return;

        await axios.delete(
            `${API}/owner/store/${storeId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchData();
    };

    const getStoreAverage = (storeId) => {
        const row = averages.find((a) => a.store_id === storeId);
        return row ? row.avg : "0.0";
    };

    const getStoreRatings = (storeId) => {
        return ratings.filter((r) => r.store_id === storeId);
    };

    if (loading) return <p className="text-slate-400">Loading...</p>;

    return (
        <div className="space-y-6">
            {/* ---------------------------------- */}
            {/* CREATE NEW STORE BUTTON */}
            {/* ---------------------------------- */}
            {!creating && (
                <button
                    className="px-4 py-2 bg-indigo-500 rounded-md text-sm text-white"
                    onClick={() => {
                        setCreating(true);
                        // Try to auto-fill email from any existing store (same owner)
                        const email = stores[0]?.email || "";
                        setForm({ name: "", address: "", email });
                    }}
                >
                    + Create New Store
                </button>
            )}

            {/* ---------------------------------- */}
            {/* CREATE STORE FORM */}
            {/* ---------------------------------- */}
            {creating && (
                <div className="space-y-3 bg-slate-900 p-4 rounded-lg border border-slate-800">
                    <h2 className="text-slate-200 font-semibold">Create Store</h2>

                    <input
                        placeholder="Store Name"
                        className="bg-slate-800 px-3 py-2 rounded-md text-sm w-full"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <input
                        placeholder="Store Email"
                        className="bg-slate-800 px-3 py-2 rounded-md text-sm w-full"
                        value={form.email}
                        readOnly // owner email fixed / inferred
                    />

                    <input
                        placeholder="Store Address"
                        className="bg-slate-800 px-3 py-2 rounded-md text-sm w-full"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={createStore}
                            className="px-4 py-2 bg-green-600 rounded-md text-sm text-white"
                        >
                            Save Store
                        </button>
                        <button
                            onClick={() => setCreating(false)}
                            className="px-4 py-2 bg-gray-700 rounded-md text-sm text-white"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ---------------------------------- */}
            {/* STORE LIST */}
            {/* ---------------------------------- */}
            {stores.length === 0 ? (
                <p className="text-slate-400">You have no stores yet.</p>
            ) : (
                stores.map((s) => {
                    const isEditing = editing === s.id;

                    return (
                        <div
                            key={s.id}
                            className="space-y-4 p-5 bg-slate-900/50 rounded-xl border border-slate-800"
                        >
                            {/* ---------------------- */}
                            {/* HEADER + ACTION BUTTONS */}
                            {/* ---------------------- */}
                            {!isEditing ? (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-xl font-semibold text-slate-50">
                                            {s.name}
                                        </h1>
                                        <p className="text-slate-400">{s.address}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setEditing(s.id);
                                                setForm({
                                                    name: s.name,
                                                    email: s.email,
                                                    address: s.address,
                                                });
                                            }}
                                            className="px-3 py-2 bg-blue-600 rounded-md text-white text-xs sm:text-sm"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteStore(s.id)}
                                            className="px-3 py-2 bg-red-600 rounded-md text-white text-xs sm:text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* ---------------------- */
                                /* EDIT FORM */
                                /* ---------------------- */
                                <div className="space-y-3 bg-slate-900 p-4 rounded-lg border border-slate-800">
                                    <h2 className="text-slate-200 font-semibold">
                                        Edit Store
                                    </h2>

                                    <input
                                        placeholder="Store Name"
                                        className="bg-slate-800 px-3 py-2 rounded-md text-sm w-full"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />

                                    <input
                                        placeholder="Store Email"
                                        className="bg-slate-800 px-3 py-2 rounded-md text-sm w-full"
                                        value={form.email}
                                        readOnly
                                    />

                                    <input
                                        placeholder="Store Address"
                                        className="bg-slate-800 px-3 py-2 rounded-md text-sm w-full"
                                        value={form.address}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => updateStore(s.id)}
                                            className="px-4 py-2 bg-green-600 rounded-md text-sm text-white"
                                        >
                                            Save
                                        </button>

                                        <button
                                            onClick={() => setEditing(null)}
                                            className="px-4 py-2 bg-gray-700 rounded-md text-sm text-white"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ---------------------- */}
                            {/* AVERAGE RATING */}
                            {/* ---------------------- */}
                            <div>
                                <p className="text-sm text-slate-300">Average Rating</p>
                                <p className="text-4xl text-yellow-300 font-bold">
                                    {getStoreAverage(s.id)}
                                </p>
                            </div>

                            {/* ---------------------- */}
                            {/* RATINGS TABLE */}
                            {/* ---------------------- */}
                            <table className="w-full border border-slate-800 rounded-xl overflow-hidden text-sm">
                                <thead className="bg-slate-800/60">
                                    <tr>
                                        <th className="p-2 text-left">User Name</th>
                                        <th className="p-2 text-left">Email</th>
                                        <th className="p-2 text-left">Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getStoreRatings(s.id).map((r, idx) => (
                                        <tr key={idx} className="border-t border-slate-800">
                                            <td className="p-2">{r.user_name}</td>
                                            <td className="p-2">{r.user_email}</td>
                                            <td className="p-2">{r.rating}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                })
            )}

        </div>
    );
};

export default OwnerDashboard;
