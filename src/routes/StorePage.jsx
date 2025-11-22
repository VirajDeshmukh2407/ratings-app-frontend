import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RatingStars from '../components/RatinsStars.jsx';

const API = import.meta.env.VITE_API_URL;

const StoresPage = () => {
    const [stores, setStores] = useState([]);
    const [filters, setFilters] = useState({ name: '', address: '' });
    const [loading, setLoading] = useState(false);
    const [ratingLoading, setRatingLoading] = useState(null);
    const [error, setError] = useState("");

    const token = localStorage.getItem('token');

    const fetchStores = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.get(`${API}/stores`, {
                params: filters,
                headers: { Authorization: `Bearer ${token}` }
            });

            setStores(res.data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load stores");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => fetchStores(), 300);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters.name, filters.address]);

    const handleRate = async (storeId, rating) => {
        try {
            setRatingLoading(storeId);

            await axios.post(
                `${API}/stores/${storeId}/rate`,
                { rating },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            fetchStores();
        } catch (err) {
            alert("Failed to submit rating", err);
        } finally {
            setRatingLoading(null);
        }
    };

    return (
        <section id="stores" className="space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-50">
                        Stores Directory
                    </h1>
                    <p className="text-sm text-slate-400">
                        Browse and rate stores. Your rating impacts their overall score.
                    </p>
                </div>

                <div className="flex gap-3">
                    <input
                        placeholder="Search by name..."
                        className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm"
                        value={filters.name}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, name: e.target.value }))
                        }
                    />
                    <input
                        placeholder="Search by address..."
                        className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm"
                        value={filters.address}
                        onChange={(e) =>
                            setFilters((f) => ({ ...f, address: e.target.value }))
                        }
                    />
                    <button
                        onClick={fetchStores}
                        className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-sm font-medium"
                    >
                        Search
                    </button>
                </div>
            </header>

            {loading && (
                <div className="text-center text-slate-400">Loading stores...</div>
            )}

            {error && (
                <div className="text-center text-red-400">{error}</div>
            )}

            {!loading && stores.length === 0 && (
                <div className="text-center text-slate-400 mt-10">
                    No stores found.
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                {stores.map((store) => (
                    <article
                        key={store.id}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-md hover:shadow-lg transition-shadow"
                    >
                        <div className="flex justify-between items-start gap-2">
                            <div>
                                <h2 className="font-semibold text-lg text-slate-50">
                                    {store.name}
                                </h2>
                                <p className="text-xs text-slate-400">{store.address}</p>
                            </div>

                            <div className="text-right text-sm">
                                <div className="text-yellow-300 font-semibold">
                                    ⭐ {store.overall_rating ? Number(store.overall_rating).toFixed(1) : "0.0"}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {store.ratings_count} ratings
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-xs text-slate-400">
                                Your rating:{' '}
                                <span className="font-semibold text-slate-100">
                                    {store.user_rating || 'Not rated'}
                                </span>
                            </div>

                            <RatingStars
                                disabled={ratingLoading === store.id}
                                value={store.user_rating || 0}
                                onChange={(r) => handleRate(store.id, r)}
                            />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default StoresPage;

