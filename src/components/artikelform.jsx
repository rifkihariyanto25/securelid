"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle, XCircle, AlertCircle, MessageSquare } from "lucide-react";

const ArtikelForm = ({ isOpen, onClose, artikel, onSubmit, formType = "add", userRole, onChangeStatus, onRejectArticle, onViewComment, adminComments }) => {
    const [formData, setFormData] = useState({
        titleartikel: "",
        kontenartikel: "",
        penulisartikel: "",
        artikel_status: "pending"
    });

    useEffect(() => {
        if (artikel && formType !== "add") {
            setFormData({
                titleartikel: artikel.titleartikel || "",
                kontenartikel: artikel.kontenartikel || "",
                penulisartikel: artikel.penulisartikel || "",
                artikel_status: artikel.artikel_status || "pending"
            });
        } else {
            setFormData({
                titleartikel: "",
                kontenartikel: "",
                penulisartikel: "",
                artikel_status: "pending"
            });
        }
    }, [artikel, formType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Always render the form, visibility controlled by the parent component
    // if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
            <div className="fixed inset-0 bg-black/50" style={{ zIndex: 9999 }}></div>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden relative" style={{ zIndex: 10000 }}>
                {/* Removed Dashboard title */}
                <div className="flex justify-between items-center p-4 border-b border-[var(--border)]">
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                        {formType === "add" ? "Tambah Artikel Baru" : formType === "edit" ? "Edit Artikel" : "Detail Artikel"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {formType === "view" && artikel && (
                         <div className="mb-4 p-3 border rounded-lg bg-gray-50">
                             <div className="flex items-center mb-2">
                                 <span className="text-sm font-medium mr-2">Status:</span>
                                 {artikel.artikel_status === "published" && (
                                     <span className="flex items-center text-green-600 text-sm">
                                         <CheckCircle size={16} className="mr-1" /> Dipublikasikan
                                     </span>
                                 )}
                                 {artikel.artikel_status === "approved" && (
                                     <span className="flex items-center text-blue-600 text-sm">
                                         <CheckCircle size={16} className="mr-1" /> Disetujui
                                     </span>
                                 )}
                                 {artikel.artikel_status === "reviewed" && (
                                     <span className="flex items-center text-indigo-600 text-sm">
                                         <AlertCircle size={16} className="mr-1" /> Ditinjau
                                     </span>
                                 )}
                                 {artikel.artikel_status === "rejected" && (
                                     <span className="flex items-center text-red-600 text-sm">
                                         <XCircle size={16} className="mr-1" /> Ditolak
                                     </span>
                                 )}
                                 {artikel.artikel_status === "pending" && (
                                     <span className="flex items-center text-amber-600 text-sm">
                                         <AlertCircle size={16} className="mr-1" /> Menunggu
                                     </span>
                                 )}
                             </div>
                             {userRole === "admin" && (
                                 <div className="flex flex-wrap gap-2 mt-2">
                                     {artikel.artikel_status === "pending" && (
                                         <>
                                             <button
                                                 type="button"
                                                 onClick={() => onChangeStatus(artikel.idartikel, "reviewed")}
                                                 className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs hover:bg-indigo-200"
                                             >
                                                 Tandai Ditinjau
                                             </button>
                                             <button
                                                 type="button"
                                                 onClick={() => onChangeStatus(artikel.idartikel, "approved")}
                                                 className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200"
                                             >
                                                 Setujui
                                             </button>
                                             <button
                                                 type="button"
                                                 onClick={() => onRejectArticle(artikel.idartikel)}
                                                 className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200"
                                             >
                                                 Tolak
                                             </button>
                                         </>
                                     )}
                                     {artikel.artikel_status === "reviewed" && (
                                         <>
                                             <button
                                                 type="button"
                                                 onClick={() => onChangeStatus(artikel.idartikel, "approved")}
                                                 className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs hover:bg-blue-200"
                                             >
                                                 Setujui
                                             </button>
                                             <button
                                                 type="button"
                                                 onClick={() => onRejectArticle(artikel.idartikel)}
                                                 className="px-3 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200"
                                             >
                                                 Tolak
                                             </button>
                                         </>
                                     )}
                                     {artikel.artikel_status === "approved" && (
                                         <button
                                             type="button"
                                             onClick={() => onChangeStatus(artikel.idartikel, "published")}
                                             className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs hover:bg-green-200"
                                         >
                                             Publikasikan
                                         </button>
                                     )}
                                 </div>
                             )}
                             {artikel.artikel_status === "rejected" && adminComments && adminComments[artikel.idartikel] && (
                                 <div className="mt-2">
                                     <button
                                         type="button"
                                         onClick={() => onViewComment(artikel.idartikel)}
                                         className="flex items-center text-blue-600 text-xs hover:underline"
                                     >
                                         <MessageSquare size={14} className="mr-1" />
                                         Lihat Alasan Penolakan
                                     </button>
                                 </div>
                             )}
                         </div>
                     )}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="titleartikel" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Judul Artikel
                            </label>
                            <input
                                type="text"
                                id="titleartikel"
                                name="titleartikel"
                                value={formData.titleartikel}
                                onChange={handleChange}
                                disabled={formType === "view"}
                                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--secondary)] text-[var(--foreground)]"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="penulisartikel" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Penulis
                            </label>
                            <input
                                type="text"
                                id="penulisartikel"
                                name="penulisartikel"
                                value={formData.penulisartikel}
                                onChange={handleChange}
                                disabled={formType === "view"}
                                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--secondary)] text-[var(--foreground)]"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="kontenartikel" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Konten Artikel
                            </label>
                            <textarea
                                id="kontenartikel"
                                name="kontenartikel"
                                value={formData.kontenartikel}
                                onChange={handleChange}
                                disabled={formType === "view"}
                                rows="5"
                                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--secondary)] text-[var(--foreground)]"
                                required
                            ></textarea>
                        </div>
                    </div>

                    {formType !== "view" && (
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--secondary)] mr-2"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/80"
                            >
                                {formType === "add" ? "Tambah" : "Simpan"}
                            </button>
                        </div>
                    )}

                    {formType === "view" && (
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/80"
                            >
                                Tutup
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ArtikelForm;