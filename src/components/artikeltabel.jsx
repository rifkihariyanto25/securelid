"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Edit,
    Trash2,
    Eye,
    Plus,
    Search,
    Calendar,
    User
} from "lucide-react";

const ArtikelTabel = () => {
    const [artikel, setArtikel] = useState([
        {
            id: 1,
            title: "Cara ngoding",
            author: "Rifki",
            category: "Programming",
            publishDate: "2024-01-15",
            image: "/api/placeholder/60/60"
        },
        {
            id: 2,
            title: "kamu nanya?",
            author: "zaky",
            category: "Web Development",
            publishDate: "2024-01-14",
            image: "/api/placeholder/60/60"
        },
        {
            id: 3,
            title: "Ikan mancing",
            author: "Hendrik",
            category: "AI/ML",
            publishDate: "2024-01-13",
            image: "/api/placeholder/60/60"
        },
        {
            id: 4,
            title: "Cara Biar Mandi",
            author: "Aarif",
            category: "Database",
            publishDate: "2024-01-12",
            image: "/api/placeholder/60/60"
        },
        {
            id: 5,
            title: "Xixixi Cahnnel",
            author: "Joshua",
            category: "Mobile",
            status: "Draft",
            publishDate: "2024-01-11",
            image: "/api/placeholder/60/60"
        }
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Filter dan search logic
    const filteredArtikel = artikel.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.author.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "All" || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredArtikel.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredArtikel.slice(startIndex, startIndex + itemsPerPage);

    // CRUD Actions
    const handleView = (id) => {
        console.log("View artikel:", id);
        // Implement view logic
    };

    const handleEdit = (id) => {
        console.log("Edit artikel:", id);
        // Implement edit logic
    };

    const handleDelete = (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
            setArtikel(artikel.filter(item => item.id !== id));
        }
    };

    const handleAdd = () => {
        console.log("Add new artikel");
        // Implement add logic
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Published":
                return "bg-green-500/20 text-green-400 border-green-500/30";
            case "Draft":
                return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
            default:
                return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        }
    };

    return (
        <motion.div
            className="bg-[rgb(0,0,0)] backdrop-blur-md shadow-lg rounded-xl p-4 md:p-8 border-[1px] border-[#3f3f3f] mx-2 md:mx-0 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-100 mb-1">
                        Artikel Management
                    </h2>
                </div>

                <motion.button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Plus size={18} />
                    Tambah Artikel
                </motion.button>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Cari artikel atau penulis..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-800/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
                    <div className="text-2xl font-bold text-gray-100">{artikel.length}</div>
                    <div className="text-sm text-gray-400">Total Artikel</div>
                </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-700">
                            <th className="text-left py-4 px-2 text-gray-300 font-semibold">Judul Artikel</th>
                            <th className="text-left py-4 px-2 text-gray-300 font-semibold hidden md:table-cell">Penulis</th>
                            <th className="text-left py-4 px-2 text-gray-300 font-semibold hidden lg:table-cell">Konten Artikel</th>
                            <th className="text-left py-4 px-2 text-gray-300 font-semibold hidden md:table-cell">Tanggal</th>
                            <th className="text-center py-4 px-2 text-gray-300 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? currentItems.map((item, index) => (
                            <motion.tr
                                key={item.id}
                                className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors duration-200"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <td className="py-4 px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                                            <span className="text-xl">{item.title.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-100 line-clamp-2 max-w-xs">
                                                {item.title}
                                            </div>
                                            <div className="text-sm text-gray-400 md:hidden">
                                                {item.author}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-2 hidden md:table-cell">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <User size={16} className="text-gray-400" />
                                        {item.author}
                                    </div>
                                </td>
                                <td className="py-4 px-2 hidden lg:table-cell">
                                    <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm border border-gray-600">
                                        {item.category}
                                    </span>
                                </td>

                                <td className="py-4 px-2 hidden md:table-cell">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                                        <Calendar size={14} />
                                        {new Date(item.publishDate).toLocaleDateString('id-ID')}
                                    </div>
                                </td>

                                <td className="py-4 px-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <motion.button
                                            onClick={() => handleView(item.id)}
                                            className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors duration-200"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            title="View"
                                        >
                                            <Eye size={16} />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleEdit(item.id)}
                                            className="p-2 text-yellow-400 hover:bg-yellow-500/20 rounded-lg transition-colors duration-200"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            title="Edit"
                                        >
                                            <Edit size={16} />
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-200"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </motion.button>
                                    </div>
                                </td>
                            </motion.tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="py-12 text-center">
                                    <div className="text-gray-400">
                                        <div className="text-lg mb-2">Tidak ada data artikel</div>
                                        <div className="text-sm">Coba ubah filter atau tambah artikel baru</div>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                    <div className="text-sm text-gray-400">
                        Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredArtikel.length)} dari {filteredArtikel.length} artikel
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Previous
                        </button>

                        <div className="flex gap-1">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${currentPage === i + 1
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg border border-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default ArtikelTabel;