"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "../../../lib/supabase";
import ArtikelForm from "../../../components/artikelform";

export default function TambahArtikelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
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

        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/login');
      }
    };

    checkUser();

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
  }, [router]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      
      // Pastikan email pengguna saat ini disimpan sebagai penulis
      const newArticleData = {
        ...formData,
        penulisartikel: currentUser?.email
      };
      
      // Create new artikel
      const { error } = await supabase
        .from('artikel')
        .insert([newArticleData]);
      
      if (error) throw error;
      
      alert("Artikel berhasil ditambahkan");
      router.push('/artikel'); // Redirect ke halaman manajemen artikel
    } catch (error) {
      console.error('Error submitting artikel:', error);
      alert(error.message || "Gagal menyimpan artikel");
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

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tambah Artikel Baru</h1>
          <p className="text-gray-600 mt-1">Buat artikel baru untuk dipublikasikan</p>
        </div>
        
        <ArtikelForm 
          artikel={{ penulisartikel: currentUser?.email }}
          onSubmit={handleSubmit}
          onClose={handleCancel}
          formType="add"
          userRole={userRole}
          isPage={true} // Tambahkan prop untuk menandakan ini adalah halaman, bukan popup
        />
      </main>
    </div>
  );
}