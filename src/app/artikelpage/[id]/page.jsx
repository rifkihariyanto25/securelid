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
  // Menghapus state loading dan isAuthenticated karena tidak perlu autentikasi
  const [loading, setLoading] = useState(false);
  const article = articles.find(article => article.id === params.id) || articles[0];
  
  // Menghapus useEffect untuk pengecekan autentikasi karena tidak diperlukan

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
      
      <main className="flex-grow container mx-auto px-4 pt-28 pb-10"> {/* Menambahkan padding top yang lebih besar agar tidak tertutup navbar */}
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
      </main>
      
      <Footer />
    </div>
  );
}