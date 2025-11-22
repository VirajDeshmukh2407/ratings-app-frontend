import React from 'react';

const RatingStars = ({ value, onChange }) => {
    const stars = [1, 2, 3, 4, 5];
    return (
        <div className="flex gap-1">
            {stars.map((s) => (
                <button
                    key={s}
                    type="button"
                    onClick={() => onChange?.(s)}
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs
            ${s <= value
                            ? 'bg-yellow-400 text-black'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                >
                    {s}
                </button>
            ))}
        </div>
    );
};

export default RatingStars;
