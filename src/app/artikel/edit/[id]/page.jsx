"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../../lib/supabase";
import ArtikelForm from "../../../../components/artikelform";

export default function EditArtikelPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [artikel, setArtikel] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkUserAndFetchArtikel = async () => {
      try {
        // Periksa sesi pengguna
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }

        // Simpan informasi user saat ini
        setCurrentUser(session.user);
        
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

        // Cek apakah pengguna memiliki akses untuk mengedit artikel ini
        // Admin dapat mengedit semua artikel, penulis hanya dapat mengedit artikelnya sendiri
        if (role !== 'admin' && artikelData.penulisartikel !== session.user.email) {
          setError('Anda tidak memiliki akses untuk mengedit artikel ini');
          return;
        }

        setArtikel(artikelData);
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

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // Update artikel
      const { error } = await supabase
        .from('artikel')
        .update(formData)
        .eq('idartikel', id);
      
      if (error) throw error;
      
      alert("Artikel berhasil diperbarui");
      router.push('/artikel'); // Redirect ke halaman manajemen artikel
    } catch (error) {
      console.error('Error updating artikel:', error);
      alert(error.message || "Gagal memperbarui artikel");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/artikel');
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

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Artikel</h1>
          <p className="text-gray-600 mt-1">Perbarui informasi artikel</p>
        </div>
        
        <ArtikelForm 
          artikel={artikel}
          onSubmit={handleSubmit}
          onClose={handleCancel}
          formType="edit"
          userRole={userRole}
          isPage={true} // Tambahkan prop untuk menandakan ini adalah halaman, bukan popup
        />
      </main>
    </div>
  );
}