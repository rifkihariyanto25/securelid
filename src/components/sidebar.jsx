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
            <div className="w-64 h-full bg-[#121212] p-4 border-r border-[#222222]">
                <div className="text-red-400 text-sm">Error loading sidebar: {error}</div>
            </div>
        );
    }

    return (
        <div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
                }`}
        >
            <div className="h-full bg-[#121212] backdrop-blur-md p-4 flex flex-col border-r border-[#222222]">
                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-full hover:bg-[#2f2f2f] transition-colors max-w-fit cursor-pointer group"
                    aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                >
                    <Menu
                        size={24}
                        className="text-gray-300 group-hover:text-white transition-colors"
                    />
                </button>

                {/* Sidebar Navigation */}
                <nav className="mt-8 flex-grow" role="navigation">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
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
                                        className={`flex items-center p-4 text-sm font-medium rounded-lg hover:bg-[#2f2f2f] transition-all duration-200 mb-2 group ${isActive
                                                ? "bg-[#2f2f2f] text-white border-l-4 border-blue-500"
                                                : "text-gray-300 hover:text-white"
                                            }`}
                                        role="menuitem"
                                    >
                                        {IconComponent ? (
                                            <IconComponent
                                                size={20}
                                                className={`flex-shrink-0 transition-colors ${isActive ? "text-blue-500" : "group-hover:text-white"
                                                    }`}
                                            />
                                        ) : (
                                            <div className="w-5 h-5 bg-gray-600 rounded flex-shrink-0" />
                                        )}
                                        {isSidebarOpen && (
                                            <span className="ml-4 whitespace-nowrap transition-opacity duration-200">
                                                {item.name}
                                            </span>
                                        )}
                                        {!isSidebarOpen && (
                                            <div className="absolute left-20 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
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