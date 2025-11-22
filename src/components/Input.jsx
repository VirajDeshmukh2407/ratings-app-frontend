import React from 'react';

const Input = ({ label, error, ...props }) => (
    <label className="flex flex-col gap-1 text-sm">
        <span className="text-slate-200">{label}</span>
        <input
            {...props}
            className="bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
);

export default Input;
