"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import supabase from '../../../lib/supabase';
import { useRouter } from 'next/navigation';



const articles = [
  {
    id: '1',
    title: 'Cara Mengenali dan Menghindari Email Phishing Seperti Profesional',
    content: `
      <p>Pelajari teknik-teknik untuk mengenali ciri-ciri email phishing yang canggih dan langkah-langkah untuk melindungi diri Anda.</p>
      <p>Email phishing adalah upaya penipuan di mana penyerang mengirimkan email yang tampak sah untuk menipu penerima agar mengungkapkan informasi sensitif seperti kata sandi, nomor kartu kredit, atau data pribadi lainnya.</p>
      <h3>Ciri-ciri Email Phishing:</h3>
      <ul>
        <li>Alamat email pengirim yang mencurigakan</li>
        <li>Kesalahan tata bahasa dan ejaan</li>
        <li>Permintaan informasi pribadi</li>
        <li>Tautan yang mencurigakan</li>
        <li>Rasa urgensi yang berlebihan</li>
      </ul>
      <h3>Cara Melindungi Diri:</h3>
      <ul>
        <li>Verifikasi identitas pengirim</li>
        <li>Jangan mengklik tautan mencurigakan</li>
        <li>Gunakan autentikasi dua faktor</li>
        <li>Perbarui perangkat lunak keamanan secara teratur</li>
        <li>Laporkan email phishing</li>
      </ul>
    `,
    date: '28 Juli 2023',
    author: 'Tim Keamanan',
    imageSrc: '/phishing.svg'
  },
];

export default function ArticlePage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const article = articles.find(article => article.id === params.id) || articles[0];
  
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Jika tidak ada session, tetap tampilkan halaman tapi tandai sebagai tidak terotentikasi
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/login');
      }
    };

    checkUser();

    // Set up auth state listener
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
      <div className="flex-1 overflow-auto relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {isAuthenticated ? (
          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative h-64 w-full">
              <Image 
                src={article.imageSrc} 
                alt={article.title} 
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{article.title}</h1>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                <span>Oleh: {article.author}</span>
                <span>{article.date}</span>
              </div>
              <div 
                className="prose max-w-none" 
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </article>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Diperlukan</h2>
              <p className="text-gray-600 mb-6">Anda perlu login untuk melihat konten artikel.</p>
              <a 
                href="/login" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
              >
                Login Sekarang
              </a>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}