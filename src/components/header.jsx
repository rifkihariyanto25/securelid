import Image from "next/image";
import React from "react";
import { Bell } from "lucide-react";

const Header = () => {
    return (
        <header className="bg-white shadow-md border-b border-[var(--border)] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
                {/* Dashboard title removed as requested */}

                {/* Bagian kanan: ikon, avatar, nama */}
                <div className="flex items-center space-x-3 sm:space-x-6">

                    {/* Notifikasi (Bell Icon) */}
                    <div className="relative">
                        <Bell className="w-5 sm:w-6 h-5 sm:h-6 text-[var(--foreground)] cursor-pointer hover:text-[var(--primary)]" />
                    </div>

                    {/* Profil Admin */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <img
                            src="/admin"
                            alt="admin"
                            width={35}
                            height={35}
                            className="rounded-full border border-[var(--border)]"
                        />
                        <span className="hidden sm:block text-[var(--foreground)] font-medium">
                            Rifki Aditya
                        </span>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
