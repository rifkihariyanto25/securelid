"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Mail, Lock } from "lucide-react";
import supabase from "../../lib/supabase.js";
import { useRouter } from "next/navigation";

export default function PengaturanPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function checkSessionAndFetchData() {
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

        // Ambil data profil
        const { data, error } = await supabase
          .from('profiles')
          .select('email, username')
          .eq('email', session.user.email)
          .single();

        if (error) throw error;
        
        // Gabungkan data dari auth dan profiles
        setUser({
          ...session.user,
          username: data.username || session.user.email.split('@')[0],
          role: role || 'user'
        });
      } catch (error) {
        console.error('Error:', error);
        setError('Gagal memuat data pengguna');
      } finally {
        setLoading(false);
      }
    }

    checkSessionAndFetchData();

    // Listener untuk perubahan status autentikasi
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        <span className="block sm:inline">Terjadi kesalahan: {error}</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Settings className="mr-2 h-6 w-6" />
            Pengaturan Akun
          </h1>
          <p className="text-gray-600 mt-1">Informasi dan pengaturan akun Anda</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Informasi Akun</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${userRole === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {userRole === 'admin' ? 'Admin' : 'User'}
              </span>
            </div>
            
            {user && (
              <div className="space-y-6">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Username</h3>
                    <p className="text-base font-medium text-gray-900 mt-1">{user.username}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-base font-medium text-gray-900 mt-1">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Lock className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Password</h3>
                    <p className="text-base font-medium text-gray-900 mt-1">••••••••</p>
                    <button 
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={() => router.push('/reset-password')}
                    >
                      Ubah password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}