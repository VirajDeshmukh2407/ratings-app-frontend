import React from 'react';
import { NavLink } from 'react-router-dom';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
            <nav className="sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-slate-800">
                <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
                    <div className="font-semibold tracking-tight text-lg">
                        Store<span className="text-indigo-400">Ratings</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <NavLink
                            to="/login"
                            className="hover:text-indigo-400 transition-colors"
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/signup"
                            className="hover:text-indigo-400 transition-colors"
                        >
                            Sign Up
                        </NavLink>
                    </div>
                </div>
            </nav>

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
                    {children}
                </div>
            </main>

            <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-400">
                FullStack Intern Challenge · Dark mode · 🚀
            </footer>
        </div>
    );
};

export default Layout;
