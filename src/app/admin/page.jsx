"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Shield } from "lucide-react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/navigation";
import AdminTabel from "../../components/admintabel";

export default function AdminPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
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

        // Ambil role dan email dari localStorage
        const role = localStorage.getItem('userRole');
        const email = localStorage.getItem('userEmail');
        setUserRole(role);
        
        console.log('Admin page - User role:', role);
        console.log('Admin page - User email:', email);

        // Hanya admin yang boleh mengakses halaman ini
        if (role !== 'admin') {
          router.push('/overview');
          return;
        }

        // Ambil data admin
        const { data, error } = await supabase
          .from('admin')
          .select('*')
          .order('username', { ascending: true });

        if (error) throw error;
        setAdmins(data || []);
      } catch (error) {
        console.error('Error:', error);
        setError('Gagal memuat data admin');
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

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="mr-2 h-6 w-6" />
            Manajemen Admin
          </h1>
          <p className="text-gray-600 mt-1">
            {userRole === 'admin' ? 'Kelola akun admin untuk sistem' : 'Anda tidak memiliki akses ke halaman ini'}
          </p>
        </div>

        {userRole === 'admin' ? (
          <AdminTabel admins={admins} loading={loading} error={error} />
        ) : (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">Anda tidak memiliki izin untuk mengakses halaman ini</span>
          </div>
        )}
      </main>
    </div>
  );
}