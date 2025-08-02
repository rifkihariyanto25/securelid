import React from "react";

const StatCard = ({ name, Icon, value }) => {
    return (
        <div className="bg-white overflow-hidden shadow-md rounded-xl border border-[var(--border)]">
            <div className="px-4 py-5 sm:p-6">
                <span className="flex items-center text-sm font-medium text-[var(--foreground)]">
                    <Icon size={20} className="mr-2" />
                    {name}
                </span>
                <p className="mt-1 text-3xl font-semibold text-[var(--primary)]">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;