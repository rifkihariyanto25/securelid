"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle, XCircle, AlertCircle, MessageSquare, Upload, Image } from "lucide-react";
import supabase from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

const ArtikelForm = ({ isOpen, onClose, artikel, onSubmit, formType = "add", userRole, onChangeStatus, onRejectArticle, onViewComment, adminComments, isPage = false }) => {
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
            setUploading(true);
            let finalFormData = {...formData};
            
            // Upload image if there's a new image file
            if (imageFile) {
                const imageUrl = await uploadImage();
                if (imageUrl) {
                    // Update formData with the image URL
                    finalFormData = {
                        ...finalFormData,
                        gambar_artikel: imageUrl
                    };
                }
            }
            
            // Ensure we're submitting the most up-to-date data
            console.log('Submitting article data:', finalFormData);
            onSubmit(finalFormData);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Terjadi kesalahan saat menyimpan artikel: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Check if we should render as a popup or as a page
    if (!isPage && !isOpen) return null;

    // Render as a page or as a popup based on isPage prop
    return isPage ? (
        // Page layout
        <div className="bg-white rounded-xl shadow-md w-full overflow-hidden">
            <form onSubmit={handleSubmit} className="p-4 space-y-6">

                {!isPage && (
                    <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
                        <h3 className="text-xl font-semibold text-gray-800">
                            {formType === "add" ? "Tambah Artikel Baru" : formType === "edit" ? "Edit Artikel" : "Detail Artikel"}
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
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
                                     <div>
                                         <span className="flex items-center text-red-600 text-sm">
                                             <XCircle size={16} className="mr-1" /> Ditolak
                                         </span>
                                         {/* Tampilkan alasan penolakan dari adminComments jika tersedia */}
                                         {adminComments && adminComments[artikel.idartikel] && (
                                             <div className="mt-1 ml-5 text-red-500 text-xs italic">
                                                 Alasan: {adminComments[artikel.idartikel].comment}
                                             </div>
                                         )}
                                         {/* Tampilkan alasan penolakan dari artikel.admin_comment jika tersedia dan adminComments tidak tersedia */}
                                         {(!adminComments || !adminComments[artikel.idartikel]) && artikel.admin_comment && (
                                             <div className="mt-1 ml-5 text-red-500 text-xs italic">
                                                 Alasan: {artikel.admin_comment}
                                             </div>
                                         )}
                                     </div>
                                 )}
                                 {artikel.artikel_status === "pending" && (
                                     <span className="flex items-center text-amber-600 text-sm">
                                         <AlertCircle size={16} className="mr-1" /> Menunggu
                                     </span>
                                 )}
                             </div>
                             {/* Alasan penolakan sudah ditampilkan langsung di bawah status */}
                             
                             {/* Tombol untuk admin */}
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

                         </div>
                     )}
                    <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="Masukkan judul artikel"
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
                                    placeholder="Masukkan nama penulis"
                                />
                            </div>
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
                                rows="8"
                                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] bg-[var(--secondary)] text-[var(--foreground)]"
                                required
                                placeholder="Masukkan konten artikel"
                            ></textarea>
                        </div>
                        
                        <div>
                            <label htmlFor="gambar_artikel" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                Gambar Artikel
                            </label>
                            {formType !== "view" ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                                    <div className="flex flex-col items-center text-center">
                                        <Image size={48} className="text-gray-400 mb-2" />
                                        <h3 className="text-gray-700 font-medium mb-1">Unggah Gambar Artikel</h3>
                                        <p className="text-sm text-gray-500 mb-3">Format: JPG, PNG, GIF atau WEBP (Maks. 2MB)</p>
                                        
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
                                            className="inline-flex items-center px-4 py-2 border border-[var(--border)] rounded-lg shadow-sm text-sm font-medium text-[var(--primary)] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                                            disabled={uploading}
                                        >
                                            <Upload size={16} className="mr-2" />
                                            {imageFile ? 'Ganti Gambar' : 'Pilih Gambar'}
                                        </button>
                                        
                                        {imageFile && (
                                            <div className="mt-2 text-sm text-[var(--foreground)]/70">
                                                {imageFile.name} ({Math.round(imageFile.size / 1024)} KB)
                                            </div>
                                        )}
                                    </div>
                                    
                                    {uploading && (
                                        <div className="mt-3 text-sm text-blue-600 flex items-center">
                                            <Upload size={16} className="mr-1 animate-pulse" /> Mengunggah gambar...
                                        </div>
                                    )}
                                    
                                    {imagePreview && (
                                        <div className="mt-4 w-full">
                                            <div className="text-sm font-medium mb-2 text-center">Preview:</div>
                                            <div className="rounded-lg overflow-hidden border border-[var(--border)] w-full max-w-md mx-auto">
                                                <img 
                                                    src={imagePreview} 
                                                    alt="Preview" 
                                                    className="w-full h-auto object-cover"
                                                    style={{ maxHeight: '200px' }}
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
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                disabled={uploading}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center shadow-sm"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Mengunggah...
                                    </>
                                ) : (
                                    formType === "add" ? "Tambah Artikel" : "Simpan Perubahan"
                                )}
                            </button>
                        </div>
                    )}

                    {formType === "view" && (
                        <div className="mt-8 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                            >
                                Tutup
                            </button>
                        </div>
                    )}
                </form>
            </div>
        ) : (
        // Popup layout
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 9999 }}>
            <div className="fixed inset-0 bg-black/50" style={{ zIndex: 9999 }}></div>
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 overflow-hidden relative" style={{ zIndex: 10000 }}>
                <div className="flex justify-between items-center p-5 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-xl font-semibold text-gray-800">
                        {formType === "add" ? "Tambah Artikel Baru" : formType === "edit" ? "Edit Artikel" : "Detail Artikel"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-6">
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
                             
                             {/* Alasan penolakan sudah ditampilkan langsung di bawah status */}
                             
                             {/* Tombol untuk admin */}
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
                                         <>
                                             <button
                                                 type="button"
                                                 onClick={() => onChangeStatus(artikel.idartikel, "published")}
                                                 className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs hover:bg-green-200"
                                             >
                                                 Publikasikan
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
                                     {/* Tombol Lihat Komentar dihapus karena alasan penolakan sudah ditampilkan langsung */}
                                 </div>
                             )}
                         </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="titleartikel" className="block text-sm font-medium text-gray-700 mb-1">
                                Judul Artikel
                            </label>
                            <input
                                type="text"
                                id="titleartikel"
                                name="titleartikel"
                                value={formData.titleartikel}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan judul artikel"
                                required
                                disabled={formType === "view"}
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="kontenartikel" className="block text-sm font-medium text-gray-700 mb-1">
                                Konten Artikel
                            </label>
                            <textarea
                                id="kontenartikel"
                                name="kontenartikel"
                                value={formData.kontenartikel}
                                onChange={handleChange}
                                rows="6"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Masukkan konten artikel"
                                required
                                disabled={formType === "view"}
                            ></textarea>
                        </div>
                        
                        <div>
                            <label htmlFor="penulisartikel" className="block text-sm font-medium text-gray-700 mb-1">
                                Penulis
                            </label>
                            <input
                                type="email"
                                id="penulisartikel"
                                name="penulisartikel"
                                value={formData.penulisartikel}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Email penulis"
                                required
                                disabled={true} // Always disabled, set by system
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Gambar Artikel
                            </label>
                            
                            {formType !== "view" ? (
                                <div className="mt-1">
                                    <div className="flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 flex items-center"
                                        >
                                            <Upload size={16} className="mr-2" />
                                            Pilih Gambar
                                        </button>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageChange}
                                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                            className="hidden"
                                        />
                                        <div className="ml-3 text-sm text-gray-500">
                                            JPG, PNG, GIF, WEBP (Maks. 2MB)
                                        </div>
                                    </div>
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
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                                disabled={uploading}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center shadow-sm"
                                disabled={uploading}
                            >
                                {uploading ? (
                                    <>
                                        <span className="animate-spin mr-2">⏳</span>
                                        Mengunggah...
                                    </>
                                ) : (
                                    formType === "add" ? "Tambah Artikel" : "Simpan Perubahan"
                                )}
                            </button>
                        </div>
                    )}

                    {formType === "view" && (
                        <div className="mt-8 flex justify-end">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
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