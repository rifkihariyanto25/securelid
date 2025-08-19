"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import supabase from "../lib/supabase";

const AdminCommentForm = ({ isOpen, onClose, artikelId, adminId, onSubmit, existingComment = null }) => {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (existingComment) {
            setComment(existingComment.comment || "");
        } else {
            setComment("");
        }
    }, [existingComment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!comment.trim()) {
                throw new Error("Komentar tidak boleh kosong");
            }

            console.log('Starting comment submission with raw values:', { artikelId, adminId, comment });
            
            // Validasi adminId - lebih ketat
            if (adminId === null || adminId === undefined) {
                console.error('Admin ID is missing:', { adminId });
                throw new Error("ID Admin tidak ditemukan. Silakan refresh halaman dan coba lagi.");
            } else if (typeof adminId !== 'number' && typeof adminId !== 'string') {
                console.error('Admin ID has invalid type:', { adminId, type: typeof adminId });
                throw new Error(`Tipe data ID Admin tidak valid: ${typeof adminId}`);
            }
            
            // Coba konversi adminId ke number untuk validasi awal
            let adminIdNum;
            if (typeof adminId === 'string') {
                adminIdNum = parseInt(adminId, 10);
                if (isNaN(adminIdNum)) {
                    console.error('Admin ID is not a valid number:', { adminId });
                    throw new Error(`ID Admin tidak valid (bukan angka): ${adminId}`);
                }
            } else if (typeof adminId === 'number') {
                adminIdNum = adminId;
            }

            // Validasi artikelId - lebih ketat
            if (artikelId === null || artikelId === undefined) {
                console.error('Artikel ID is missing:', { artikelId });
                throw new Error("ID Artikel tidak ditemukan. Silakan refresh halaman dan coba lagi.");
            } else if (typeof artikelId !== 'number' && typeof artikelId !== 'string') {
                console.error('Artikel ID has invalid type:', { artikelId, type: typeof artikelId });
                throw new Error(`Tipe data ID Artikel tidak valid: ${typeof artikelId}`);
            }
            
            // Coba konversi artikelId ke number untuk validasi awal
            let artikelIdNum;
            if (typeof artikelId === 'string') {
                artikelIdNum = parseInt(artikelId, 10);
                if (isNaN(artikelIdNum)) {
                    console.error('Artikel ID is not a valid number:', { artikelId });
                    throw new Error(`ID Artikel tidak valid (bukan angka): ${artikelId}`);
                }
            } else if (typeof artikelId === 'number') {
                artikelIdNum = artikelId;
            }

            console.log('Submitting comment with:', { artikelId, adminId, comment });

            if (existingComment) {
                // Update existing comment
                const { error } = await supabase
                    .from('admin_comment')
                    .update({ comment })
                    .eq('id', existingComment.id);

                if (error) {
                    console.error('Error updating comment:', error);
                    // Handle empty error object case
                    const errorDetails = Object.keys(error).length === 0 ? 'Terjadi kesalahan tidak diketahui' : (error.message || JSON.stringify(error));
                    throw new Error(`Gagal memperbarui komentar: ${errorDetails}`);
                }
            } else {
                // Create new comment
                // Pastikan artikel_id dan admin_id adalah tipe data yang benar (bigint)
                let artikel_id, admin_id;
                
                try {
                    // Coba konversi ke number terlebih dahulu
                    // Gunakan nilai yang sudah divalidasi sebelumnya
                    artikel_id = artikelIdNum;
                    admin_id = adminIdNum;
                    
                    // Pastikan nilai tidak undefined
                    if (artikel_id === undefined) {
                        console.error('artikelIdNum is undefined after validation');
                        throw new Error('ID Artikel tidak valid setelah validasi');
                    }
                    
                    if (admin_id === undefined) {
                        console.error('adminIdNum is undefined after validation');
                        throw new Error('ID Admin tidak valid setelah validasi');
                    }
                    
                    // Add more detailed logging
                    console.log('Processing IDs for insertion:', { 
                        artikel_id, 
                        admin_id, 
                        comment,
                        artikelId_type: typeof artikelId,
                        adminId_type: typeof adminId,
                        artikelId_raw: artikelId,
                        adminId_raw: adminId
                    });
                    
                    // Check for invalid IDs
                    if (isNaN(artikel_id)) {
                        console.error('artikelId is NaN after conversion:', artikelId);
                        throw new Error(`ID Artikel tidak valid (NaN): ${artikelId}`);
                    }
                    
                    if (isNaN(admin_id)) {
                        console.error('adminId is NaN after conversion:', adminId);
                        throw new Error(`ID Admin tidak valid (NaN): ${adminId}`);
                    }
                    
                    // Pastikan ID adalah bilangan bulat positif
                    if (artikel_id <= 0) {
                        throw new Error(`ID Artikel harus positif: ${artikel_id}`);
                    }
                    
                    if (admin_id <= 0) {
                        throw new Error(`ID Admin harus positif: ${admin_id}`);
                    }
                } catch (conversionError) {
                    console.error('Error converting IDs:', conversionError);
                    throw new Error(`Error konversi ID: ${conversionError.message}`);
                }
                
                console.log('Skipping admin_comment table insertion, will only update artikel table');
            }

            // Update artikel status to rejected and save comment directly to artikel table
            // Pastikan idartikel adalah tipe data yang benar (bigint)
            const idartikel = parseInt(artikelId, 10);
            console.log('Updating artikel status with parsed ID:', { 
                idartikel, 
                artikelId_raw: artikelId,
                isNaN_idartikel: isNaN(idartikel) 
            });
            
            // Check for invalid ID
            if (isNaN(idartikel)) {
                throw new Error(`ID Artikel tidak valid untuk update status: ${artikelId}`);
            }
            
            const { data: updatedArtikel, error: artikelError } = await supabase
                .from('artikel')
                .update({ 
                    artikel_status: 'rejected',
                    admin_comment: comment // Simpan komentar langsung ke kolom admin_comment di tabel artikel
                })
                .eq('idartikel', idartikel)
                .select('*')
                .single();

            if (artikelError) {
                console.error('Error updating artikel status:', artikelError);
                // Handle empty error object case
                const errorDetails = Object.keys(artikelError).length === 0 ? 'Terjadi kesalahan tidak diketahui' : (artikelError.message || JSON.stringify(artikelError));
                throw new Error(`Gagal mengubah status artikel: ${errorDetails}`);
            }

            console.log('Article status updated successfully:', updatedArtikel);
            // Panggil callback dengan data artikel yang diperbarui
            if (onSubmit && typeof onSubmit === 'function') {
                onSubmit(updatedArtikel);
            }
            onClose();
        } catch (error) {
            console.error('Error submitting comment:', error);
            
            // Pastikan error ditampilkan dengan benar
            let errorMessage;
            if (error.message) {
                errorMessage = error.message;
            } else if (typeof error === 'object') {
                // Handle empty object case
                errorMessage = Object.keys(error).length === 0 
                    ? 'Terjadi kesalahan tidak diketahui' 
                    : JSON.stringify(error);
            } else {
                errorMessage = "Terjadi kesalahan saat menolak artikel";
            }
            
            // Log error details untuk debugging
            console.log('Error details:', {
                errorType: typeof error,
                errorMessage: errorMessage,
                errorObject: error,
                adminId: adminId,
                artikelId: artikelId,
                adminId_type: typeof adminId,
                artikelId_type: typeof artikelId
            });
            
            setError(errorMessage);
            
            // Jika callback onSubmit tersedia, panggil dengan error untuk penanganan di komponen induk
            if (onSubmit && typeof onSubmit === 'function') {
                onSubmit(null, errorMessage);
            }
            
            // Jangan tutup form jika terjadi error
            // Biarkan pengguna melihat pesan error dan mencoba lagi
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black/50"></div>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative z-10">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold">
                        {existingComment ? "Edit Komentar Penolakan" : "Tambah Komentar Penolakan"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                            Alasan Penolakan
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Berikan alasan mengapa artikel ini ditolak..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            disabled={loading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Menyimpan..." : existingComment ? "Perbarui" : "Tolak Artikel"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCommentForm;