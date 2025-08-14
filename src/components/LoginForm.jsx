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
      {/* Left side - Indonesian Cultural Background */}
      <div className="hidden lg:flex w-1/2 relative">
        <Image
          src="/background.png"
          alt="Indonesian Cultural Background"
          fill
          className="object-cover"
          priority
        />
        {/* Logo overlay */}
        <div className="absolute top-8 left-8 z-10">
          <div className="bg-white rounded-lg px-4 py-2 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800">
              Secura<span className="text-blue-600">ID</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex flex-col justify-center px-8 md:px-16 w-full lg:w-1/2 bg-gray-50">
        <div className="max-w-md mx-auto w-full">
          {/* Mobile logo - only shown on small screens */}
          <div className="mb-8 lg:hidden text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Secura<span className="text-blue-600">ID</span>
            </h2>
          </div>

          {/* Login Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Login</h1>
            <p className="text-gray-600">
              Silakan masukkan email dan kata sandi Anda untuk melanjutkan
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Ingat Kata Sandi</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                href="/sign-up"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}