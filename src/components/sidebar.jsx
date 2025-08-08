"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Bell,
    Home as House,
    Settings,
    Users,
    Info,
    LogOut,
    Menu
} from "lucide-react";
import supabase from "../lib/supabase";

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
    const [userRole, setUserRole] = useState(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                setIsLoading(true);
                
                // Periksa sesi pengguna
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    router.push('/login');
                    return;
                }
                
                // Ambil role dari localStorage
                let role = localStorage.getItem('userRole');
                
                // Jika tidak ada di localStorage, coba ambil dari database
                if (!role) {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('email', session.user.email)
                        .single();
                    
                    role = profileData?.role || 'user';
                    localStorage.setItem('userRole', role);
                }
                
                setUserRole(role);
                
                // Ambil data sidebar
                const res = await fetch("/data/data.json");
                if (!res.ok) throw new Error("Failed to fetch data");
                const data = await res.json();
                
                // Filter menu berdasarkan role
                let filteredItems;
                if (role === 'admin') {
                    // Admin dapat melihat semua menu
                    filteredItems = data.sidebarItems || [];
                } else {
                    // User biasa hanya dapat melihat Beranda, Artikel, dan Logout
                    filteredItems = (data.sidebarItems || []).filter(item => 
                        ['Beranda', 'Artikel', 'Logout'].includes(item.name)
                    );
                }
                
                setSidebarItems(filteredItems);
                setError(null);
            } catch (err) {
                console.error("Error loading sidebar data:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSidebarData();
    }, [router]);

    const handleItemClick = async (item) => {
        if (item.name === "Logout") {
            try {
                // Logout dari Supabase
                await supabase.auth.signOut();
                
                // Hapus role dari localStorage
                localStorage.removeItem('userRole');
                
                // Redirect ke halaman login
                router.push('/login');
            } catch (error) {
                console.error('Error during logout:', error);
            }
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