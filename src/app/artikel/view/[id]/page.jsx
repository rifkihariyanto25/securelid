"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "../../../../lib/supabase";
import ArtikelForm from "../../../../components/artikelform";
import AdminCommentForm from "../../../../components/admincommentform";

export default function ViewArtikelPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  
  const [loading, setLoading] = useState(true);
  const [artikel, setArtikel] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const [adminComments, setAdminComments] = useState({});
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [adminId, setAdminId] = useState(null);

  // Fungsi untuk mengambil komentar admin (didefinisikan sebelum useEffect)
  const fetchAdminComments = async (artikelId) => {
    try {
      console.log('Fetching admin comments for artikel ID:', artikelId);
      const { data, error } = await supabase
        .from('admin_comment')
        .select('*')
        .eq('artikel_id', artikelId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 adalah kode untuk 'tidak ada data'
        throw error;
      }
      
      if (data) {
        console.log('Admin comment data received:', data);
        // Simpan komentar dalam format yang sama dengan yang digunakan di ArtikelTabel
        const commentsByArticle = {};
        commentsByArticle[artikelId] = data;
        setAdminComments(commentsByArticle);
        console.log('Updated adminComments state:', commentsByArticle);
      } else {
        console.log('No admin comment data found for artikel ID:', artikelId);
        // Coba cek apakah ada komentar di kolom admin_comment pada tabel artikel
        const { data: artikelData, error: artikelError } = await supabase
          .from('artikel')
          .select('admin_comment')
          .eq('idartikel', artikelId)
          .single();
        
        if (artikelError) {
          console.error('Error fetching artikel admin_comment:', artikelError);
        } else if (artikelData && artikelData.admin_comment) {
          console.log('Found admin_comment in artikel table:', artikelData.admin_comment);
          // Buat objek komentar dari admin_comment di tabel artikel
          const commentsByArticle = {};
          commentsByArticle[artikelId] = { comment: artikelData.admin_comment };
          setAdminComments(commentsByArticle);
          console.log('Updated adminComments state from artikel table:', commentsByArticle);
        }
      }
    } catch (error) {
      console.error('Error fetching admin comments:', error);
    }
  };

  useEffect(() => {
    const checkUserAndFetchArtikel = async () => {
      try {
        // Periksa sesi pengguna
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }
        
        // Ambil role dari localStorage
        const role = localStorage.getItem('userRole');
        setUserRole(role);

        // Ambil data artikel berdasarkan ID
        const { data: artikelData, error: artikelError } = await supabase
          .from('artikel')
          .select('*')
          .eq('idartikel', id)
          .single();

        if (artikelError) {
          throw artikelError;
        }

        if (!artikelData) {
          setError('Artikel tidak ditemukan');
          return;
        }

        setArtikel(artikelData);
        
        // Ambil komentar admin jika artikel ditolak
        if (artikelData.artikel_status === 'rejected') {
          console.log('Artikel ditolak, mengambil komentar admin...');
          await fetchAdminComments(artikelData.idartikel);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'Terjadi kesalahan saat memuat artikel');
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchArtikel();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [id, router]);

  const handleClose = () => {
    router.push('/artikel');
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
      const { data: artikelData } = await supabase
        .from('artikel')
        .select('*')
        .eq('idartikel', id)
        .single();

      setArtikel(artikelData);
      alert(`Status artikel berhasil diubah`);
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
      // Reset error state
      setError(null);
      
      // Pastikan adminId tersedia
      if (!adminId && userRole === 'admin') {
        console.log('Admin ID not found, fetching...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('Sesi pengguna tidak ditemukan. Silakan login kembali.');
        }
        
        console.log('User session:', session.user.email);
        
        const { data: adminData, error: adminError } = await supabase
          .from('admin')
          .select('id')
          .eq('email', session.user.email)
          .single();
        
        if (adminError) {
          console.error('Error fetching admin ID:', adminError);
          throw new Error(`Gagal mendapatkan ID admin: ${adminError.message}`);
        }
        
        if (!adminData) {
          throw new Error('Data admin tidak ditemukan. Silakan refresh halaman dan coba lagi.');
        }
        
        // Pastikan ID admin adalah number
        const parsedAdminId = typeof adminData.id === 'string' ? parseInt(adminData.id, 10) : adminData.id;
        console.log('Admin ID fetched successfully:', parsedAdminId, 'type:', typeof parsedAdminId);
        
        if (isNaN(parsedAdminId)) {
          throw new Error(`ID Admin tidak valid: ${adminData.id}`);
        }
        
        // Update state dengan ID admin yang valid
        setAdminId(parsedAdminId);
        
        // Buka form komentar setelah ID admin tersedia
        setTimeout(() => {
          setIsCommentFormOpen(true);
          console.log('Comment form opened with adminId:', parsedAdminId);
        }, 100);
      } else {
        // AdminId sudah tersedia, langsung buka form
        console.log('Using existing admin ID:', adminId, 'type:', typeof adminId);
        setIsCommentFormOpen(true);
      }
    } catch (error) {
      console.error('Error preparing rejection form:', error);
      alert(error.message || 'Terjadi kesalahan saat menyiapkan form penolakan');
    }
  };
  
  // Fungsi untuk melihat komentar penolakan
  const handleViewComment = async (artikelId) => {
    try {
      console.log('handleViewComment called for artikel ID:', artikelId);
      console.log('Current adminComments state:', adminComments);
      
      // Jika adminComments belum diambil, coba ambil lagi
      if (!adminComments[artikelId]) {
        console.log('No comments found for this article, fetching...');
        await fetchAdminComments(artikelId);
      }
      
      // Cek apakah ada komentar untuk artikel ini setelah fetch
      console.log('adminComments after fetch:', adminComments);
      
      if (adminComments[artikelId]) {
        const comment = adminComments[artikelId];
        alert(`Alasan Penolakan: ${comment.comment}`);
      } else {
        console.log('Still no comments found after fetching');
        alert("Tidak ada komentar penolakan untuk artikel ini");
      }
    } catch (error) {
      console.error('Error viewing comment:', error);
      alert(error.message || 'Terjadi kesalahan saat melihat komentar');
    }
  };

  if (loading) {
    return (
      <div className="flex-1 overflow-auto relative z-10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto relative z-10 flex items-center justify-center">
        <div className="text-center bg-red-100 p-6 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => router.push('/artikel')} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!artikel) {
    return (
      <div className="flex-1 overflow-auto relative z-10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Artikel tidak ditemukan</p>
          <button 
            onClick={() => router.push('/artikel')} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  // Fungsi untuk menangani submit form komentar
  const handleCommentSubmit = async (updatedArtikel = null, errorMessage = null) => {
    try {
      // Jika ada error message, tampilkan error dan jangan lakukan apa-apa
      if (errorMessage) {
        console.error('Error from AdminCommentForm:', errorMessage);
        return;
      }
      
      console.log('Comment submitted successfully');
      
      // Jika updatedArtikel diberikan dari AdminCommentForm, gunakan itu
      if (updatedArtikel) {
        console.log('Using updated article data from form:', updatedArtikel);
        setArtikel(updatedArtikel);
      } else {
        // Jika tidak, refresh data dari database
        console.log('Refreshing article data from database...');
        const { data: artikelData, error: artikelError } = await supabase
          .from('artikel')
          .select('*')
          .eq('idartikel', id)
          .single();

        if (artikelError) {
          console.error('Error fetching updated article data:', artikelError);
          throw artikelError;
        }
        
        console.log('Article data refreshed:', artikelData);
        setArtikel(artikelData);
      }
      
      // Ambil komentar admin karena artikel sudah ditolak
      console.log('Article is rejected, fetching admin comments...');
      await fetchAdminComments(id);
      
      setIsCommentFormOpen(false);
      alert("Artikel berhasil ditolak");
    } catch (error) {
      console.error('Error after submitting comment:', error);
      // Tetap tutup form dan refresh halaman meskipun terjadi error
      setIsCommentFormOpen(false);
      alert("Artikel berhasil ditolak, tetapi terjadi error saat memperbarui tampilan: " + (error.message || 'Terjadi kesalahan tidak diketahui'));
    }
  };
  
  // Fungsi untuk menutup form komentar
  const handleCloseCommentForm = () => {
    setIsCommentFormOpen(false);
  };

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Detail Artikel</h1>
          <p className="text-gray-600 mt-1">Melihat informasi artikel</p>
        </div>
        
        <ArtikelForm 
          artikel={artikel}
          onClose={handleClose}
          formType="view"
          userRole={userRole}
          isPage={true} // Tambahkan prop untuk menandakan ini adalah halaman, bukan popup
          onChangeStatus={handleChangeStatus}
          onRejectArticle={handleRejectArticle}
          onViewComment={handleViewComment}
          adminComments={adminComments}
        />
        
        {/* Form komentar admin untuk penolakan artikel */}
      <AdminCommentForm
        isOpen={isCommentFormOpen}
        artikelId={artikel ? artikel.idartikel : null}
        adminId={adminId}
        onSubmit={handleCommentSubmit}
        onClose={handleCloseCommentForm}
      />
      </main>
    </div>
  );
}