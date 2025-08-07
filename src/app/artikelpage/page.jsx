"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import ArticleCard from '../../components/ArticleCard';
import supabase from '../../lib/supabase';
import { useRouter } from 'next/navigation';

const articles = [
  {
    id: '1',
    title: 'Cara Mengenali dan Menghindari Email Phishing Seperti Profesional',
    excerpt: 'Pelajari teknik-teknik untuk mengenali ciri-ciri email phishing dan langkah-langkah untuk melindungi diri Anda.',
    date: '28 Juli 2023',
    author: 'Tim Keamanan',
    imageSrc: '/phishing.svg'
  },
  {
    id: '2',
    title: 'Cara Mengenali dan Menghindari Email Phishing Seperti Profesional',
    excerpt: 'Pelajari teknik-teknik untuk mengenali ciri-ciri email phishing yang canggih dan langkah-langkah untuk melindungi diri Anda.',
    date: '25 Juli 2023',
    author: 'Tim Keamanan',
    imageSrc: '/phishing.svg'
  },
  {
    id: '3',
    title: 'Cara Mengenali dan Menghindari Email Phishing Seperti Profesional',
    excerpt: 'Pelajari teknik-teknik untuk mengenali ciri-ciri email phishing yang canggih dan langkah-langkah untuk melindungi diri Anda.',
    date: '23 Juli 2023',
    author: 'Tim Keamanan',
    imageSrc: '/phishing.svg'
  },
  {
    id: '4',
    title: 'Cara Mengenali dan Menghindari Email Phishing Seperti Profesional',
    excerpt: 'Pelajari teknik-teknik untuk mengenali ciri-ciri email phishing yang canggih dan langkah-langkah untuk melindungi diri Anda.',
    date: '21 Juli 2023',
    author: 'Tim Keamanan',
    imageSrc: '/phishing.svg'
  },
  {
    id: '5',
    title: 'Cara Mengenali dan Menghindari Email Phishing Seperti Profesional',
    excerpt: 'Pelajari teknik-teknik untuk mengenali ciri-ciri email phishing yang canggih dan langkah-langkah untuk melindungi diri Anda.',
    date: '20 Juli 2023',
    author: 'Tim Keamanan',
    imageSrc: '/phishing.svg'
  },
  {
    id: '6',
    title: 'Cara Mengenali dan Menghindari Email Phishing Seperti Profesional',
    excerpt: 'Pelajari teknik-teknik untuk mengenali ciri-ciri email phishing yang canggih dan langkah-langkah untuk melindungi diri Anda.',
    date: '19 Juli 2023',
    author: 'Tim Keamanan',
    imageSrc: '/phishing.svg'
  },
];

export default function ArticlesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
          <>
            <div className="bg-blue-500 text-white rounded-lg p-6 mb-8 text-center">
              <h1 className="text-2xl font-bold mb-2">Semua Artikel</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard 
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  date={article.date}
                  author={article.author}
                  imageSrc={article.imageSrc}
                />
              ))}
            </div>
          </>
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