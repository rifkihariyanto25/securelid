"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import ArticleCard from '../../components/ArticleCard';
import supabase from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch articles from database
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);

      // Hanya ambil artikel yang statusnya 'approved' atau 'published'
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .in('artikel_status', ['approved', 'published'])
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-28 pb-10">
          <div className="text-center">
            <p className="text-red-600 text-lg">{error}</p>
            <button
              onClick={fetchArticles}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Coba Lagi
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 pt-28 pb-10">
        <div className="bg-blue-500 text-white rounded-lg p-6 mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Semua Artikel</h1>
          <p className="text-blue-100">
            {articles.length} artikel tersedia
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Belum ada artikel yang dipublikasikan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.idartikel}
                id={article.idartikel}
                title={article.titleartikel}
                excerpt={article.kontenartikel ?
                  article.kontenartikel.substring(0, 150) + '...' :
                  'Tidak ada excerpt'
                }
                date={new Date(article.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                author={article.penulisartikel || 'Anonim'}
                imageSrc="/phishing.svg" // Default image, bisa disesuaikan
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}