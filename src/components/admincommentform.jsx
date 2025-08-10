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

            if (existingComment) {
                // Update existing comment
                const { error } = await supabase
                    .from('admin_comment')
                    .update({ comment })
                    .eq('id', existingComment.id);

                if (error) throw error;
            } else {
                // Create new comment
                const { error } = await supabase
                    .from('admin_comment')
                    .insert([{
                        artikel_id: artikelId,
                        admin_id: adminId,
                        comment
                    }]);

                if (error) throw error;
            }

            // Update artikel status to rejected
            const { error: artikelError } = await supabase
                .from('artikel')
                .update({ artikel_status: 'rejected' })
                .eq('idartikel', artikelId);

            if (artikelError) throw artikelError;

            onSubmit && onSubmit();
            onClose();
        } catch (error) {
            console.error('Error submitting comment:', error);
            setError(error.message);
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