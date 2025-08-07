"use client";

import React, { useState, useEffect } from "react";
import {
    Edit,
    Trash2,
    Eye,
    Plus,
    Search,
    Calendar,
    User,
    Loader2
} from "lucide-react";
import supabase from "../lib/supabase";
import ArtikelForm from "./artikelform";

const ArtikelTabel = () => {
    const [artikel, setArtikel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    // Form state
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formType, setFormType] = useState("add"); // add, edit, view
    const [currentArtikel, setCurrentArtikel] = useState(null);
    
    // Fetch artikel from Supabase
    useEffect(() => {
        fetchArtikel();
    }, []);
    
    const fetchArtikel = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('artikel')
                .select('*')
                .order('created_at', { ascending: false });
                
            if (error) throw error;
            
            setArtikel(data || []);
        } catch (error) {
            console.error('Error fetching artikel:', error);
            setError('Gagal memuat data artikel');
        } finally {
            setLoading(false);
        }
    };

    // Filter dan search logic
    const filteredArtikel = artikel.filter(item => {
        const matchesSearch = 
            (item.titleartikel && item.titleartikel.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.penulisartikel && item.penulisartikel.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterStatus === "All" || item.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredArtikel.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredArtikel.slice(startIndex, startIndex + itemsPerPage);

    // CRUD Actions
    const handleView = (id) => {
        const artikelToView = artikel.find(item => item.idartikel === id);
        setCurrentArtikel(artikelToView);
        setFormType("view");
        setIsFormOpen(true);
    };

    const handleEdit = (id) => {
        const artikelToEdit = artikel.find(item => item.idartikel === id);
        setCurrentArtikel(artikelToEdit);
        setFormType("edit");
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
            try {
                setLoading(true);
                const { error } = await supabase
                    .from('artikel')
                    .delete()
                    .eq('idartikel', id);
                
                if (error) throw error;
                
                // Refresh data setelah menghapus
                fetchArtikel();
                alert("Artikel berhasil dihapus");
            } catch (error) {
                console.error('Error deleting artikel:', error);
                alert("Gagal menghapus artikel");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleAdd = () => {
        setCurrentArtikel(null);
        setFormType("add");
        setIsFormOpen(true);
    };
    
    const handleFormSubmit = async (formData) => {
        try {
            setLoading(true);
            
            if (formType === "add") {
                // Create new artikel
                const { error } = await supabase
                    .from('artikel')
                    .insert([formData]);
                
                if (error) throw error;
                alert("Artikel berhasil ditambahkan");
            } else if (formType === "edit") {
                // Update existing artikel
                const { error } = await supabase
                    .from('artikel')
                    .update(formData)
                    .eq('idartikel', currentArtikel.idartikel);
                
                if (error) throw error;
                alert("Artikel berhasil diperbarui");
            }
            
            // Close form and refresh data
            setIsFormOpen(false);
            fetchArtikel();
        } catch (error) {
            console.error('Error submitting artikel:', error);
            alert("Gagal menyimpan artikel");
        } finally {
            setLoading(false);
        }
    };
    
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setCurrentArtikel(null);
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
        <div className="bg-white shadow-md rounded-xl p-4 md:p-8 border border-[var(--border)] mx-2 md:mx-0 mb-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    {/* Artikel Management title removed as requested */}
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-[var(--primary)] hover:bg-[var(--primary)]/80 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                    <Plus size={18} />
                    Tambah Artikel
                </button>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Bar */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground)]/60" size={18} />
                    <input
                        type="text"
                        placeholder="Cari artikel atau penulis..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-lg pl-10 pr-4 py-2 text-[var(--foreground)] placeholder-[var(--foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                </div>

            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[var(--secondary)] rounded-lg p-4 border border-[var(--border)]">
                    <div className="text-2xl font-bold text-[var(--primary)]">{artikel.length}</div>
                    <div className="text-sm text-[var(--foreground)]/70">Total Artikel</div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
                    <span className="ml-2 text-[var(--foreground)]">Memuat data...</span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Table */}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border)]">
                                <th className="text-left py-4 px-2 text-[var(--foreground)] font-semibold">Judul Artikel</th>
                                <th className="text-left py-4 px-2 text-[var(--foreground)] font-semibold hidden md:table-cell">Penulis</th>
                                <th className="text-left py-4 px-2 text-[var(--foreground)] font-semibold hidden lg:table-cell">Konten Artikel</th>
                                <th className="text-left py-4 px-2 text-[var(--foreground)] font-semibold hidden md:table-cell">Tanggal</th>
                                <th className="text-center py-4 px-2 text-[var(--foreground)] font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? currentItems.map((item) => (
                                <tr
                                    key={item.idartikel}
                                    className="border-b border-[var(--border)] hover:bg-[var(--secondary)]/50 transition-colors duration-200"
                                >
                                    <td className="py-4 px-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                                                <span className="text-xl text-[var(--primary)]">{item.titleartikel ? item.titleartikel.charAt(0) : '?'}</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-[var(--foreground)] line-clamp-2 max-w-xs">
                                                    {item.titleartikel}
                                                </div>
                                                <div className="text-sm text-[var(--foreground)]/70 md:hidden">
                                                    {item.penulisartikel}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 hidden md:table-cell">
                                        <div className="flex items-center gap-2 text-[var(--foreground)]">
                                            <User size={16} className="text-[var(--foreground)]/70" />
                                            {item.penulisartikel}
                                        </div>
                                    </td>
                                    <td className="py-4 px-2 hidden lg:table-cell">
                                        <span className="bg-[var(--secondary)] text-[var(--foreground)] px-3 py-1 rounded-full text-sm border border-[var(--border)]">
                                            {item.kontenartikel ? (item.kontenartikel.length > 30 ? item.kontenartikel.substring(0, 30) + '...' : item.kontenartikel) : 'Tidak ada konten'}
                                        </span>
                                    </td>

                                    <td className="py-4 px-2 hidden md:table-cell">
                                        <div className="flex items-center gap-2 text-[var(--foreground)]/70 text-sm">
                                            <Calendar size={14} />
                                            {new Date(item.created_at).toLocaleDateString('id-ID')}
                                        </div>
                                    </td>

                                    <td className="py-4 px-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleView(item.idartikel)}
                                                className="p-2 text-[var(--primary)] hover:bg-[var(--secondary)] rounded-lg transition-colors duration-200"
                                                title="View"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item.idartikel)}
                                                className="p-2 text-amber-500 hover:bg-[var(--secondary)] rounded-lg transition-colors duration-200"
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.idartikel)}
                                                className="p-2 text-red-500 hover:bg-[var(--secondary)] rounded-lg transition-colors duration-200"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="py-12 text-center">
                                        <div className="text-[var(--foreground)]/70">
                                            <div className="text-lg mb-2">Tidak ada data artikel</div>
                                            <div className="text-sm">Coba ubah filter atau tambah artikel baru</div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

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
            
            {/* Form Popup */}
            {isFormOpen && (
                <ArtikelForm 
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    artikel={currentArtikel}
                    onSubmit={handleFormSubmit}
                    formType={formType}
                />
            )}
        </div>
    );
};

export default ArtikelTabel;