"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import supabase from "../../lib/supabase";
import { useRouter } from "next/navigation";
import PenggunaTabel from "../../components/penggunatabel";




export default function PenggunaPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkSessionAndFetchData() {
      try {
        // Periksa sesi pengguna
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Ambil data profil
        const { data, error } = await supabase
          .from('profiles')
          .select('email, username')
          .order('username', { ascending: true });

        if (error) throw error;
        setProfiles(data || []);
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

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="mr-2 h-6 w-6" />
            Data Pengguna
          </h1>
          <p className="text-gray-600 mt-1">Daftar pengguna yang terdaftar dalam sistem</p>
        </div>
        
        <PenggunaTabel users={profiles} loading={loading} error={error} />
      </main>
    </div>
  );
}