"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle, XCircle, AlertCircle, MessageSquare, Upload, Image } from "lucide-react";
import supabase from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

const ArtikelForm = ({ isOpen, onClose, artikel, onSubmit, formType = "add", userRole, onChangeStatus, onRejectArticle, onViewComment, adminComments }) => {
    const [formData, setFormData] = useState({
        titleartikel: "",
        kontenartikel: "",
        penulisartikel: "",
        artikel_status: "pending",
        gambar_artikel: null
    });
    
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (artikel && formType !== "add") {
            setFormData({
                titleartikel: artikel.titleartikel || "",
                kontenartikel: artikel.kontenartikel || "",
                penulisartikel: artikel.penulisartikel || "",
                artikel_status: artikel.artikel_status || "pending",
                gambar_artikel: artikel.gambar_artikel || null
            });
            
            // Set image preview if article has an image
            if (artikel.gambar_artikel) {
                setImagePreview(artikel.gambar_artikel);
            } else {
                setImagePreview(null);
            }
        } else {
            setFormData({
                titleartikel: "",
                kontenartikel: "",
                penulisartikel: "",
                artikel_status: "pending",
                gambar_artikel: null
            });
            setImagePreview(null);
            setImageFile(null);
        }
    }, [artikel, formType]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Handle image file selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Format file tidak didukung. Silakan pilih file gambar (JPG, PNG, GIF, atau WEBP)');
            return;
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Ukuran file maksimal 2MB');
            return;
        }
        
        setImageFile(file);
        
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };
    
    // Upload image to Supabase Storage
    const uploadImage = async () => {
        if (!imageFile) return null;
        
        try {
            setUploading(true);
            
            // Create unique filename
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = fileName;
            
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('artikel')
                .upload(filePath, imageFile, {
                    cacheControl: '3600',
                    upsert: false
                });
                
            if (error) throw error;
            
            // Get public URL
            const { data: urlData } = supabase.storage
                .from('artikel')
                .getPublicUrl(filePath);
                
            return urlData.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Gagal mengunggah gambar: ' + error.message);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Upload image if there's a new image file
            if (imageFile) {
                setUploading(true);
                const imageUrl = await uploadImage();
                if (imageUrl) {
                    // Update formData with the image URL
                    setFormData(prev => ({
                        ...prev,
                        gambar_artikel: imageUrl
                    }));
                    
                    // Submit with updated image URL
                    onSubmit({
                        ...formData,
                        gambar_artikel: imageUrl
                    });
                } else {
                    // If image upload failed, submit without image
                    onSubmit(formData);
                }
            } else {
                // No new image, submit as is
                onSubmit(formData);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Terjadi kesalahan saat menyimpan artikel');
        } finally {
            setUploading(false);
        }
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
                             {/* Gambar Artikel Preview */}
                             {artikel.gambar_artikel && (
                                <div className="mb-3">
                                    <div className="rounded-lg overflow-hidden border border-[var(--border)] w-full">
                                        <img 
                                            src={artikel.gambar_artikel} 
                                            alt={artikel.titleartikel} 
                                            className="w-full h-auto object-cover"
                                            style={{ maxHeight: '250px' }}
                                        />
                                    </div>
                                </div>
                             )}
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
                        
                        <div>
                            <label htmlFor="gambar_artikel" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Gambar Artikel
                            </label>
                            {formType !== "view" ? (
                                <div className="mt-1 flex flex-col gap-2">
                                    <div className="flex items-center">
                                        <input
                                            type="file"
                                            id="gambar_artikel"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            disabled={uploading}
                                            className="hidden"
                                            ref={fileInputRef}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="inline-flex items-center px-4 py-2 border border-[var(--border)] rounded-lg shadow-sm text-sm font-medium text-[var(--foreground)] bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                                            disabled={uploading}
                                        >
                                            <Upload size={16} className="mr-2" />
                                            {imageFile ? 'Ganti Gambar' : 'Pilih Gambar'}
                                        </button>
                                        {imageFile && (
                                            <span className="ml-2 text-sm text-[var(--foreground)]/70">
                                                {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                                            </span>
                                        )}
                                    </div>
                                    {uploading && (
                                         <div className="text-sm text-blue-600 flex items-center">
                                             <Upload size={16} className="mr-1 animate-pulse" /> Mengunggah gambar...
                                         </div>
                                     )}
                                     {imagePreview && (
                                         <div className="mt-2">
                                             <div className="text-sm font-medium mb-1">Preview:</div>
                                             <div className="rounded-lg overflow-hidden border border-[var(--border)] w-full max-w-xs">
                                                 <img 
                                                     src={imagePreview} 
                                                     alt="Preview" 
                                                     className="w-full h-auto object-cover"
                                                     style={{ maxHeight: '150px' }}
                                                 />
                                             </div>
                                         </div>
                                     )}
                                </div>
                            ) : formData.gambar_artikel ? (
                                <div className="text-sm text-[var(--foreground)]/70">
                                    Gambar tersedia
                                </div>
                            ) : (
                                <div className="text-sm text-[var(--foreground)]/70">
                                    Tidak ada gambar
                                </div>
                            )}
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mt-2 relative">
                                    <div className="relative rounded-lg overflow-hidden border border-[var(--border)] w-full max-w-xs">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-full h-auto object-cover"
                                            style={{ maxHeight: '200px' }}
                                        />
                                        {formType !== "view" && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setImageFile(null);
                                                    setFormData(prev => ({ ...prev, gambar_artikel: null }));
                                                }}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {formType !== "view" && (
                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--secondary)] mr-2"
                                disabled={uploading}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary)]/80 flex items-center"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Mengunggah...
                                    </>
                                ) : (
                                    formType === "add" ? "Tambah" : "Simpan"
                                )}
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