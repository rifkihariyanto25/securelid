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
    Loader2,
    CheckCircle,
    XCircle,
    AlertCircle,
    MessageSquare
} from "lucide-react";
import supabase from "../lib/supabase";
import ArtikelForm from "./artikelform";
import AdminCommentForm from "./admincommentform";

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
    
    // State untuk menyimpan informasi user dan role
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    
    // State untuk form komentar admin
    const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
    const [currentArtikelId, setCurrentArtikelId] = useState(null);
    const [adminId, setAdminId] = useState(null);
    const [adminComments, setAdminComments] = useState({});
    
    // Fetch artikel from Supabase
    useEffect(() => {
        // Periksa sesi dan role pengguna terlebih dahulu
        checkUserAndFetchArtikel();
    }, []);
    
    // Fetch admin comments for rejected articles
    useEffect(() => {
        if (artikel.length > 0) {
            fetchAdminComments();
        }
    }, [artikel]);
    
    const checkUserAndFetchArtikel = async () => {
        try {
            // Periksa sesi pengguna
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            
            // Simpan informasi user saat ini
            setCurrentUser(session.user);
            
            // Ambil role dari localStorage
            const role = localStorage.getItem('userRole');
            setUserRole(role);
            
            // Fetch artikel berdasarkan role
            fetchArtikel(session.user.email, role);
        } catch (error) {
            console.error('Error checking user session:', error);
            setError('Gagal memuat sesi pengguna');
            setLoading(false);
        }
    };
    
    const fetchArtikel = async (userEmail, role) => {
        try {
            setLoading(true);
            
            let query = supabase
                .from('artikel')
                .select('*')
                .order('created_at', { ascending: false });
            
            // Jika bukan admin, filter artikel berdasarkan email pengguna
            if (role !== 'admin') {
                query = query.eq('penulisartikel', userEmail);
            }
            
            const { data, error } = await query;
                
            if (error) throw error;
            
            setArtikel(data || []);
            
            // Jika admin, ambil ID admin untuk digunakan saat membuat komentar
            if (role === 'admin') {
                const { data: adminData, error: adminError } = await supabase
                    .from('admin')
                    .select('id')
                    .eq('email', userEmail)
                    .single();
                
                if (!adminError && adminData) {
                    setAdminId(adminData.id);
                    console.log('Admin ID set:', adminData.id);
                } else {
                    console.error('Error fetching admin ID:', adminError);
                }
            }
        } catch (error) {
            console.error('Error fetching artikel:', error);
            setError('Gagal memuat data artikel');
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch admin comments for articles
    const fetchAdminComments = async () => {
        try {
            const { data, error } = await supabase
                .from('admin_comment')
                .select('*');
            
            if (error) throw error;
            
            // Organize comments by artikel_id
            const commentsByArticle = {};
            data.forEach(comment => {
                commentsByArticle[comment.artikel_id] = comment;
            });
            
            setAdminComments(commentsByArticle);
        } catch (error) {
            console.error('Error fetching admin comments:', error);
        }
    };

    // Filter dan search logic
    const filteredArtikel = artikel.filter(item => {
        const searchMatch = (
            item.titleartikel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.penulisartikel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.kontenartikel?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const statusMatch = filterStatus === "All" || item.artikel_status === filterStatus;
        
        return searchMatch && statusMatch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredArtikel.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredArtikel.slice(startIndex, startIndex + itemsPerPage);

    // CRUD Actions
    const handleView = (id) => {
        const artikelToView = artikel.find(item => item.idartikel === id);
        if (artikelToView) {
            setCurrentArtikel(artikelToView);
            setFormType("view");
            setIsFormOpen(true);
        }
    };

    const handleEdit = (id) => {
        const artikelToEdit = artikel.find(item => item.idartikel === id);
        
        // Cek apakah artikel milik pengguna saat ini (kecuali admin)
        if (userRole !== 'admin' && artikelToEdit.penulisartikel !== currentUser?.email) {
            alert("Anda tidak memiliki izin untuk mengedit artikel ini");
            return;
        }
        
        setCurrentArtikel(artikelToEdit);
        setFormType("edit");
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            // Cek apakah artikel milik pengguna saat ini (kecuali admin)
            const artikelToDelete = artikel.find(item => item.idartikel === id);
            
            if (userRole !== 'admin' && artikelToDelete.penulisartikel !== currentUser?.email) {
                alert("Anda tidak memiliki izin untuk menghapus artikel ini");
                return;
            }
            
            if (window.confirm("Apakah Anda yakin ingin menghapus artikel ini?")) {
                setLoading(true);
                const { error } = await supabase
                    .from('artikel')
                    .delete()
                    .eq('idartikel', id);
                
                if (error) throw error;
                
                // Refresh data setelah menghapus
                fetchArtikel(currentUser?.email, userRole);
                alert("Artikel berhasil dihapus");
            }
        } catch (error) {
            console.error('Error deleting artikel:', error);
            alert(error.message || "Gagal menghapus artikel");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setCurrentArtikel({
            penulisartikel: currentUser?.email // Set the current user's email as the author
        });
        setFormType("add");
        setIsFormOpen(true);
    };
    
    const handleFormSubmit = async (formData) => {
        try {
            setLoading(true);
            
            if (formType === "add") {
                // Pastikan email pengguna saat ini disimpan sebagai penulis
                const newArticleData = {
                    ...formData,
                    penulisartikel: currentUser?.email
                };
                
                // Create new artikel
                const { error } = await supabase
                    .from('artikel')
                    .insert([newArticleData]);
                
                if (error) throw error;
                alert("Artikel berhasil ditambahkan");
            } else if (formType === "edit") {
                // Pastikan pengguna hanya dapat mengedit artikel miliknya sendiri (kecuali admin)
                if (userRole !== 'admin' && currentArtikel.penulisartikel !== currentUser?.email) {
                    throw new Error("Anda tidak memiliki izin untuk mengedit artikel ini");
                }
                
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
            fetchArtikel(currentUser?.email, userRole);
        } catch (error) {
            console.error('Error submitting artikel:', error);
            alert(error.message || "Gagal menyimpan artikel");
        } finally {
            setLoading(false);
        }
    };
    
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setCurrentArtikel(null);
    };
    
    // Fungsi untuk menangani perubahan status artikel
    const handleChangeStatus = async (artikelId, newStatus) => {
        try {
            setLoading(true);
            
            const { error } = await supabase
                .from('artikel')
                .update({ artikel_status: newStatus })
                .eq('idartikel', artikelId);
            
            if (error) throw error;
            
            // Refresh data setelah mengubah status
            fetchArtikel(currentUser?.email, userRole);
            alert(`Status artikel berhasil diubah menjadi ${getStatusText(newStatus)}`);
        } catch (error) {
            console.error('Error changing article status:', error);
            alert(error.message || "Gagal mengubah status artikel");
        } finally {
            setLoading(false);
        }
    };
    
    // Fungsi untuk menolak artikel dan menambahkan komentar
    const handleRejectArticle = async (artikelId) => {
        try {
            console.log('Starting handleRejectArticle with:', { artikelId, adminId, userRole });
            
            // Pastikan adminId tersedia
            if (!adminId && userRole === 'admin') {
                console.log('Admin ID not found, fetching again...');
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    console.log('Session found:', { userEmail: session.user.email });
                    
                    const { data: adminData, error: adminError } = await supabase
                        .from('admin')
                        .select('id')
                        .eq('email', session.user.email)
                        .single();
                    
                    if (adminError) {
                        console.error('Error fetching admin ID:', adminError);
                        throw new Error(`Gagal mendapatkan ID admin: ${adminError.message || JSON.stringify(adminError)}`);
                    }
                    
                    if (adminData) {
                        console.log('Admin data found:', adminData);
                        // Ensure adminId is a number
                        const adminIdValue = typeof adminData.id === 'string' ? parseInt(adminData.id, 10) : adminData.id;
                        setAdminId(adminIdValue);
                        console.log('Admin ID set:', adminIdValue);
                    } else {
                        console.error('Admin data not found for email:', session.user.email);
                        throw new Error('Data admin tidak ditemukan. Silakan refresh halaman dan coba lagi.');
                    }
                } else {
                    console.error('No session found');
                    throw new Error('Sesi pengguna tidak ditemukan. Silakan login kembali.');
                }
            }
            
            // Tambahkan pengecekan final untuk adminId
            if (!adminId && userRole === 'admin') {
                console.error('Admin ID still not available after fetch attempt');
                throw new Error('ID Admin masih tidak tersedia. Silakan refresh halaman dan coba lagi.');
            }
            
            console.log('Opening comment form with:', { currentArtikelId: artikelId, adminId });
            setCurrentArtikelId(artikelId);
            setIsCommentFormOpen(true);
        } catch (error) {
            console.error('Error preparing rejection form:', error);
            alert(error.message || 'Terjadi kesalahan saat menyiapkan form penolakan');
        }
    };
    
    // Fungsi untuk melihat komentar penolakan
    const handleViewComment = async (artikelId) => {
        try {
            const comment = adminComments[artikelId];
            if (comment) {
                alert(`Alasan Penolakan: ${comment.comment}`);
            } else {
                alert("Tidak ada komentar penolakan untuk artikel ini");
            }
        } catch (error) {
            console.error('Error viewing comment:', error);
            alert("Gagal melihat komentar");
        }
    };
    
    // Fungsi untuk menangani submit form komentar
    const handleCommentSubmit = async () => {
        try {
            // Refresh data setelah menambahkan komentar
            console.log('Refreshing data after comment submission');
            await fetchArtikel(currentUser?.email, userRole);
            await fetchAdminComments();
            alert("Artikel berhasil ditolak");
        } catch (error) {
            console.error('Error after submitting comment:', error);
            
            // Log detailed error information
            if (typeof error === 'object') {
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                    code: error.code,
                    isEmpty: Object.keys(error).length === 0
                });
            }
            
            // Tetap tampilkan pesan sukses karena penolakan artikel berhasil
            // meskipun ada error saat refresh data
            alert("Artikel berhasil ditolak");
            
            // Coba refresh data lagi setelah beberapa detik
            setTimeout(() => {
                console.log('Attempting to re-fetch data after delay');
                fetchArtikel(currentUser?.email, userRole)
                    .catch(e => console.error('Error re-fetching artikel:', e));
                fetchAdminComments()
                    .catch(e => console.error('Error re-fetching comments:', e));
            }, 2000);
        }
    };
    
    // Fungsi untuk menutup form komentar
    const handleCloseCommentForm = () => {
        setIsCommentFormOpen(false);
        setCurrentArtikelId(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "published":
                return "bg-green-500/20 text-green-500 border-green-500/30";
            case "approved":
                return "bg-blue-500/20 text-blue-500 border-blue-500/30";
            case "reviewed":
                return "bg-indigo-500/20 text-indigo-500 border-indigo-500/30";
            case "pending":
                return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
            case "rejected":
                return "bg-red-500/20 text-red-500 border-red-500/30";
            default:
                return "bg-gray-500/20 text-gray-500 border-gray-500/30";
        }
    };
    
    const getStatusText = (status) => {
        switch (status) {
            case "published":
                return "Dipublikasikan";
            case "approved":
                return "Disetujui";
            case "reviewed":
                return "Ditinjau";
            case "pending":
                return "Menunggu";
            case "rejected":
                return "Ditolak";
            default:
                return "Tidak diketahui";
        }
    };

    return (
        <div className="bg-white shadow-md rounded-xl p-4 md:p-8 border border-[var(--border)] mx-2 md:mx-0 mb-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--foreground)]">
                        Manajemen Artikel
                        {userRole && (
                            <span className={`ml-2 px-2 py-1 text-xs rounded-full ${userRole === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                {userRole === 'admin' ? 'Admin' : 'User'}
                            </span>
                        )}
                    </h2>
                    <p className="text-sm text-[var(--foreground)]/70 mt-1">
                        {userRole === 'admin' 
                            ? 'Anda dapat mengelola semua artikel' 
                            : 'Anda hanya dapat mengelola artikel yang Anda buat'}
                    </p>
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
                
                {/* Status Filter */}
                <div className="w-full md:w-auto">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full bg-[var(--secondary)] border border-[var(--border)] rounded-lg px-4 py-2 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    >
                        <option value="All">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="reviewed">Ditinjau</option>
                        <option value="approved">Disetujui</option>
                        <option value="rejected">Ditolak</option>
                        <option value="published">Dipublikasikan</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-[var(--secondary)] rounded-lg p-4 border border-[var(--border)]">
                    <div className="text-2xl font-bold text-[var(--primary)]">{artikel.length}</div>
                    <div className="text-sm text-[var(--foreground)]/70">
                        {userRole === 'admin' ? 'Total Artikel' : 'Artikel Anda'}
                    </div>
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
                                <th className="text-center py-4 px-2 text-[var(--foreground)] font-semibold">Status</th>
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

                                    <td className="py-4 px-2 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.artikel_status)}`}>
                                            {getStatusText(item.artikel_status)}
                                        </span>
                                    </td>

                                    <td className="py-4 px-2">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleView(item.idartikel)}
                                                className="p-2 text-[var(--primary)] hover:bg-[var(--secondary)] rounded-lg transition-colors duration-200"
                                                title="Lihat"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            
                                            {/* Edit button - only for pending articles or admin */}
                                            {(userRole === 'admin' || item.artikel_status === 'pending' || item.artikel_status === 'rejected') && (
                                                <button
                                                    onClick={() => handleEdit(item.idartikel)}
                                                    className="p-2 text-amber-500 hover:bg-[var(--secondary)] rounded-lg transition-colors duration-200"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            )}
                                            
                                            {/* Delete button */}
                                            <button
                                                onClick={() => handleDelete(item.idartikel)}
                                                className="p-2 text-red-500 hover:bg-[var(--secondary)] rounded-lg transition-colors duration-200"
                                                title="Hapus"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center">
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
            
            {/* Form Modal */}
            {isFormOpen && (
                <ArtikelForm
                    isOpen={isFormOpen}
                    onClose={handleCloseForm}
                    artikel={currentArtikel}
                    onSubmit={handleFormSubmit}
                    formType={formType}
                    userRole={userRole}
                    onChangeStatus={handleChangeStatus}
                    onRejectArticle={handleRejectArticle}
                    onViewComment={handleViewComment}
                    adminComments={adminComments}
                />
            )}
            
            {/* Admin Comment Form */}
            {isCommentFormOpen && (
                <AdminCommentForm
                    isOpen={isCommentFormOpen}
                    onClose={handleCloseCommentForm}
                    artikelId={currentArtikelId}
                    adminId={adminId}
                    onSubmit={handleCommentSubmit}
                    existingComment={adminComments[currentArtikelId]}
                />
            )}
        </div>
    );
};

export default ArtikelTabel;