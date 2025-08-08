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
      </main>
      
      <Footer />
    </div>
  );
}