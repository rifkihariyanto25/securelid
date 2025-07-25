import Image from "next/image";
import React from "react";
import { Bell } from "lucide-react";

const Header = () => {
    return (
        <header className="bg-[#1e1e1e] shadow-lg border-b border-[#1f1f1f] mx-4 sm:mx-6 lg:mx-8 mt-4 mb-2 rounded-lg sticky top-0 z-50 backdrop-blur">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-100">
                    Dashboard
                </h1>

                {/* Bagian kanan: ikon, avatar, nama */}
                <div className="flex items-center space-x-3 sm:space-x-6">

                    {/* Notifikasi (Bell Icon) */}
                    <div className="relative">
                        <Bell className="w-5 sm:w-6 h-5 sm:h-6 text-gray-300 cursor-pointer hover:text-white" />
                    </div>

                    {/* Profil Admin */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <img
                            src="/admin"
                            alt="admin"
                            width={35}
                            height={35}
                            className="rounded-full border border-gray-600"
                        />
                        <span className="hidden sm:block text-gray-100 font-medium">
                            Rifki Aditya
                        </span>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
