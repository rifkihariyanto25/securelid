"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const ArtikelForm = ({ isOpen, onClose, artikel, onSubmit, formType = "add" }) => {
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