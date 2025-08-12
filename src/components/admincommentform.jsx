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

            if (!adminId) {
                console.error('Admin ID is missing:', { adminId });
                throw new Error("ID Admin tidak ditemukan. Silakan refresh halaman dan coba lagi.");
            }

            if (!artikelId) {
                console.error('Artikel ID is missing:', { artikelId });
                throw new Error("ID Artikel tidak ditemukan. Silakan refresh halaman dan coba lagi.");
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
                const artikel_id = parseInt(artikelId, 10);
                const admin_id = parseInt(adminId, 10);
                
                // Add more detailed logging
                console.log('Inserting comment with parsed IDs:', { 
                    artikel_id, 
                    admin_id, 
                    comment,
                    artikelId_type: typeof artikelId,
                    adminId_type: typeof adminId,
                    artikelId_raw: artikelId,
                    adminId_raw: adminId,
                    isNaN_artikel_id: isNaN(artikel_id),
                    isNaN_admin_id: isNaN(admin_id)
                });
                
                // Check for invalid IDs
                if (isNaN(artikel_id)) {
                    throw new Error(`ID Artikel tidak valid: ${artikelId}`);
                }
                
                if (isNaN(admin_id)) {
                    throw new Error(`ID Admin tidak valid: ${adminId}`);
                }
                
                const { data, error } = await supabase
                    .from('admin_comment')
                    .insert([{
                        artikel_id: artikel_id,
                        admin_id: admin_id,
                        comment
                    }]);

                if (error) {
                    console.error('Error inserting comment:', error);
                    // Handle empty error object case
                    const errorDetails = Object.keys(error).length === 0 ? 'Terjadi kesalahan tidak diketahui' : (error.message || JSON.stringify(error));
                    throw new Error(`Gagal menyimpan komentar: ${errorDetails}`);
                }
                console.log('Comment inserted successfully:', data);
            }

            // Update artikel status to rejected
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
            
            const { error: artikelError } = await supabase
                .from('artikel')
                .update({ artikel_status: 'rejected' })
                .eq('idartikel', idartikel);

            if (artikelError) {
                console.error('Error updating artikel status:', artikelError);
                // Handle empty error object case
                const errorDetails = Object.keys(artikelError).length === 0 ? 'Terjadi kesalahan tidak diketahui' : (artikelError.message || JSON.stringify(artikelError));
                throw new Error(`Gagal mengubah status artikel: ${errorDetails}`);
            }

            console.log('Article status updated successfully');
            onSubmit && onSubmit();
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
            setError(errorMessage);
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