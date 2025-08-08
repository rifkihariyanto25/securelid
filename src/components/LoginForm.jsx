'use client';

import { useState } from 'react';
import supabase from '../lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Login dengan Supabase Auth terlebih dahulu
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Setelah login berhasil, cek apakah user adalah admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin')
        .select('*')
        .eq('email', email)
        .single();
      
      // Tentukan role berdasarkan keberadaan di tabel admin
      const role = adminData ? 'admin' : 'user';
      
      // Update profile dengan role
      await supabase
        .from('profiles')
        .update({ 
          last_login: new Date().toISOString(),
          is_online: true,
          role: role // Set role berdasarkan hasil pengecekan
        })
        .eq('email', email);
      
      // Simpan role dan email di localStorage
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);
      
      console.log('Login successful - Role:', role);
      console.log('Login successful - Email:', email);
      
      // Redirect berdasarkan role
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/artikel');
      }


    } catch (error) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Login Form */}
      <div className="flex flex-col justify-center px-8 md:px-16 w-full lg:w-1/2">
        <div className="mb-2">
          <div className="mb-6">
            <Image src="/fingger-logo.svg" alt="Fingger Logo" width={96} height={32} />
          </div>
          <h1 className="text-4xl font-bold mb-2">Holla,</h1>
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-gray-500">Hey, welcome back to your special place</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-6">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <div>
            <input
              type="email"
              placeholder="stanley@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
            />
          </div>
          
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-purple-600"
              />
              <span className="text-sm">Remember me</span>
            </label>
            
            <Link href="/forgot-password" className="text-sm text-gray-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-purple-600 text-white py-3 rounded-md font-medium hover:bg-purple-700 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account? <Link href="/sign-up" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">Sign Up</Link>
          </p>
        </div>
      </div>
      
      {/* Right side - Illustration */}
      <div className="hidden lg:flex items-center justify-center w-1/2 bg-purple-600 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-64 h-96 bg-black/10 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-white/30 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 border-2 border-white/30 rounded-full flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                        <Image src="/fingerprint.svg" alt="Fingerprint" width={32} height={32} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-10 text-center text-white/70 text-xs">
                  <p>Place your finger</p>
                  <p>to get into your phone</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-1/4 bg-white rounded-full p-2 shadow-lg">
              <Image src="/checkmark.svg" alt="Checkmark" width={24} height={24} />
            </div>
          </div>
          <div className="absolute -right-20 bottom-20">
            <Image src="/circle.svg" alt="Circle" width={64} height={64} />
          </div>
        </div>
        
        {/* Cloud decorations */}
        <div className="absolute top-10 left-10">
          <Image src="/cloud.svg" alt="Cloud" width={120} height={60} />
        </div>
        <div className="absolute bottom-10 right-10">
          <Image src="/cloud.svg" alt="Cloud" width={120} height={60} />
        </div>
        
        {/* Lock icon */}
        <div className="absolute right-20 top-1/2">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <Image src="/lock.svg" alt="Lock" width={32} height={32} />
          </div>
        </div>
      </div>
    </div>
  );
}