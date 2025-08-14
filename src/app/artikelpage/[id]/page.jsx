"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import supabase from '../../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ArticlePage({ params }) {
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch article from database
  useEffect(() => {
    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);

      // Ambil artikel berdasarkan ID dan pastikan statusnya approved/published
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .eq('idartikel', params.id)
        .in('artikel_status', ['approved', 'published'])
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Article not found or not approved
          setError('Artikel tidak ditemukan atau belum dipublikasikan');
        } else {
          throw error;
        }
        return;
      }

      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
      setError('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  // Function to format content with basic HTML
  const formatContent = (content) => {
    if (!content) return '';

    // Simple formatting: convert line breaks to paragraphs
    return content
      .split('\n\n')
      .map(paragraph => `<p class="mb-4">${paragraph.replace(/\n/g, '<br>')}</p>`)
      .join('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat artikel...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-28 pb-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {error || 'Artikel tidak ditemukan'}
            </h1>
            <p className="text-gray-600 mb-6">
              Artikel yang Anda cari mungkin telah dihapus atau belum dipublikasikan.
            </p>
            <Link
              href="/artikelpage"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Kembali ke Daftar Artikel
            </Link>
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
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm">
            <Link href="/artikelpage" className="text-blue-500 hover:text-blue-700">
              Artikel
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-600 truncate">{article.titleartikel}</span>
          </nav>
        </div>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Article Header Image */}
          <div className="relative h-64 md:h-80 w-full">
            <Image
              src="/phishing.svg" // Default image, bisa disesuaikan
              alt={article.titleartikel}
              fill
              className="object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {article.titleartikel}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm text-gray-500 mb-8 pb-4 border-b">
              <div className="flex items-center mb-2 sm:mb-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                    {(article.penulisartikel || 'A').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-700">
                    {article.penulisartikel || 'Anonim'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span>
                  {new Date(article.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                {article.update_at && article.update_at !== article.created_at && (
                  <span className="text-xs text-gray-400">
                    (Diperbarui: {new Date(article.update_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })})
                  </span>
                )}
              </div>
            </div>

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
              style={{
                lineHeight: '1.8',
                fontSize: '16px'
              }}
              dangerouslySetInnerHTML={{
                __html: formatContent(article.kontenartikel)
              }}
            />
          </div>
        </article>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            href="/artikelpage"
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Daftar Artikel
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}