"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import ArticleCard from '../../components/ArticleCard';
import supabase from '../../lib/supabase';
import { useRouter } from 'next/navigation';
// Import Swiper components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-coverflow';

// Custom styles for Swiper
import './swiper-styles.css';

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
          <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">Belum ada artikel yang dipublikasikan</p>
            <p className="text-gray-400 mt-2">Artikel akan segera hadir. Silakan kunjungi kembali nanti.</p>
          </div>
        ) : (
          <>
            {/* Artikel Slider */}
            <div className="mb-12">
              <div className="mb-6 flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-blue-700 mb-2">Artikel Pilihan</h2>
                  <p className="text-gray-600">Artikel terbaru dan terpopuler untuk Anda</p>
                </div>
                <div className="hidden md:flex items-center text-sm text-gray-500">
                  <span className="mr-2">Geser untuk melihat lebih banyak</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                  }}
                  className="mySwiper"
                  effect="coverflow"
                  coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                  }}
                  grabCursor={true}
                  centeredSlides={true}
                >
                  {articles.slice(0, 6).map((article) => (
                    <SwiperSlide key={article.idartikel}>
                      <div className="p-2">
                        <ArticleCard
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
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* Semua Artikel */}
            <div className="mb-6">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-bold text-blue-700 mb-2">Semua Artikel</h2>
                  <p className="text-gray-600">Jelajahi semua artikel yang tersedia</p>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {articles.length} artikel tersedia
                  </span>
                </div>
              </div>
            </div>
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}