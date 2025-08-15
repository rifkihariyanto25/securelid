"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../../lib/supabase";
import ArtikelForm from "../../../../components/artikelform";
import AdminCommentForm from "../../../../components/admincommentform";

export default function ViewArtikelPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [artikel, setArtikel] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const [adminComments, setAdminComments] = useState({});
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [adminId, setAdminId] = useState(null);

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
          fetchAdminComments(artikelData.idartikel);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message || 'Terjadi kesalahan saat memuat artikel');
      } finally {
        setLoading(false);
      }
    };

    checkUserAndFetchArtikel();
    
    // Fungsi untuk mengambil komentar admin
    const fetchAdminComments = async (artikelId) => {
      try {
        const { data, error } = await supabase
          .from('admin_comment')
          .select('*')
          .eq('artikel_id', artikelId)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 adalah kode untuk 'tidak ada data'
          throw error;
        }
        
        if (data) {
          // Simpan komentar dalam format yang sama dengan yang digunakan di ArtikelTabel
          const commentsByArticle = {};
          commentsByArticle[artikelId] = data;
          setAdminComments(commentsByArticle);
        }
      } catch (error) {
        console.error('Error fetching admin comments:', error);
      }
    };

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
      // Pastikan adminId tersedia
      if (!adminId && userRole === 'admin') {
        console.log('Admin ID not found, fetching...');
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: adminData, error: adminError } = await supabase
            .from('admin')
            .select('id')
            .eq('email', session.user.email)
            .single();
          
          if (adminError) {
            console.error('Error fetching admin ID:', adminError);
            throw new Error(`Gagal mendapatkan ID admin: ${adminError.message}`);
          }
          
          if (adminData) {
            const adminIdValue = typeof adminData.id === 'string' ? parseInt(adminData.id, 10) : adminData.id;
            setAdminId(adminIdValue);
          } else {
            throw new Error('Data admin tidak ditemukan. Silakan refresh halaman dan coba lagi.');
          }
        } else {
          throw new Error('Sesi pengguna tidak ditemukan. Silakan login kembali.');
        }
      }
      
      // Tambahkan pengecekan final untuk adminId
      if (!adminId && userRole === 'admin') {
        throw new Error('ID Admin masih tidak tersedia. Silakan refresh halaman dan coba lagi.');
      }
      
      // Ubah status artikel menjadi rejected
       const { error } = await supabase
         .from('artikel')
         .update({ artikel_status: 'rejected' })
         .eq('idartikel', artikelId);
      
      if (error) throw error;
      
      setIsCommentFormOpen(true);
    } catch (error) {
      console.error('Error preparing rejection form:', error);
      alert(error.message || 'Terjadi kesalahan saat menyiapkan form penolakan');
    }
  };
  
  // Fungsi untuk melihat komentar penolakan
  const handleViewComment = async (artikelId) => {
    try {
      // Cek apakah ada komentar untuk artikel ini
      if (adminComments[artikelId]) {
        const comment = adminComments[artikelId];
        alert(`Alasan Penolakan: ${comment.comment}`);
      } else {
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
  const handleCommentSubmit = async () => {
    try {
      // Refresh data setelah menambahkan komentar
      const { data: artikelData, error: artikelError } = await supabase
        .from('artikel')
        .select('*')
        .eq('idartikel', id)
        .single();

      if (artikelError) throw artikelError;
      setArtikel(artikelData);
      
      // Ambil komentar admin jika artikel ditolak
      if (artikelData.artikel_status === 'rejected') {
        await fetchAdminComments(artikelData.idartikel);
      }
      
      setIsCommentFormOpen(false);
      alert("Artikel berhasil ditolak");
    } catch (error) {
      console.error('Error after submitting comment:', error);
      alert("Artikel berhasil ditolak");
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
        {isCommentFormOpen && (
          <AdminCommentForm
            artikelId={artikel.idartikel}
            adminId={adminId}
            onSubmit={handleCommentSubmit}
            onClose={handleCloseCommentForm}
          />
        )}
      </main>
    </div>
  );
}