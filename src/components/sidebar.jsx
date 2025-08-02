"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Bell,
    Home as House,
    Settings,
    Users,
    Info,
    LogOut,
    Menu
} from "lucide-react";

const ICONS = {
    House,
    Settings,
    Users,
    Bell,
    Info,
    LogOut
};

const Sidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [sidebarItems, setSidebarItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                setIsLoading(true);
                const res = await fetch("/data/data.json");
                if (!res.ok) throw new Error("Failed to fetch data");
                const data = await res.json();
                setSidebarItems(data.sidebarItems || []);
                setError(null);
            } catch (err) {
                console.error("Error loading sidebar data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSidebarData();
    }, []);

    const handleItemClick = (item) => {
        if (item.name === "Logout") {
            // Handle logout logic here
            console.log("Logout clicked");
            // e.g., clear session, redirect, etc.
        }
    };

    if (error) {
        return (
            <div className="w-64 h-full bg-white p-4 border-r border-[var(--border)]">
                <div className="text-red-500 text-sm">Error loading sidebar: {error}</div>
            </div>
        );
    }

    return (
        <div
            className={`relative z-10 transition-all duration-200 flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
                }`}
        >
            <div className="h-full bg-white p-4 flex flex-col border-r border-[var(--border)]">
                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-full hover:bg-[var(--secondary)] transition-colors max-w-fit cursor-pointer"
                    aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <Menu
                        size={24}
                        className="text-[var(--foreground)]"
                    />
                </button>

                {/* Sidebar Navigation */}
                <nav className="mt-8 flex-grow" role="navigation">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--primary)]"></div>
                        </div>
                    ) : (
                        sidebarItems.map((item) => {
                            const IconComponent = ICONS[item.icon];
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => handleItemClick(item)}
                                    className="block"
                                >
                                    <div
                                        className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[var(--secondary)] transition-all duration-200 mb-2 group ${isActive
                                                ? "bg-[var(--secondary)] text-[var(--foreground)] border-l-4 border-[var(--primary)]"
                                                : "text-[var(--foreground)]"
                                            }`}
                                        role="menuitem"
                                    >
                                        {IconComponent ? (
                                            <IconComponent
                                                size={20}
                                                className={`flex-shrink-0 ${isActive ? "text-[var(--primary)]" : ""}`}
                                            />
                                        ) : (
                                            <div className="w-5 h-5 bg-[var(--secondary)] rounded flex-shrink-0" />
                                        )}
                                        {isSidebarOpen && (
                                            <span className="ml-4 whitespace-nowrap transition-opacity duration-200">
                                                {item.name}
                                            </span>
                                        )}
                                        {!isSidebarOpen && (
                                            <div className="absolute left-20 bg-[var(--secondary)] text-[var(--foreground)] px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                                {item.name}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;