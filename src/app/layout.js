"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";

import Header from "../components/header";
import Sidebar from "../components/sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata harus dipindahkan ke file metadata.js terpisah karena "use client" directive
// tidak kompatibel dengan ekspor metadata

export default function RootLayout({ children }) {
  const pathname = usePathname();
  // Halaman yang tidak menampilkan sidebar
  const noSidebarPages = ["/landingpage", "/", "/login", "/sign-up", "/forgot-password", "/reset-password", "/artikelpage"];
  
  // Cek apakah halaman saat ini adalah halaman artikel dengan ID dinamis
  const isArticleDetailPage = pathname.startsWith('/artikelpage/') && pathname !== '/artikelpage/';
  
  // Halaman tidak menampilkan sidebar jika termasuk dalam daftar atau merupakan halaman detail artikel
  const isNoSidebarPage = noSidebarPages.includes(pathname) || isArticleDetailPage;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {isNoSidebarPage ? (
          // Layout khusus untuk halaman tanpa sidebar (landing page, login, sign-up, artikelpage, dll)
          <div className="overflow-auto">
            {children}
          </div>
        ) : (
          // Layout default dengan sidebar untuk halaman admin
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-auto">
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
                {/* Header removed to eliminate Dashboard text */}
                {children}
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
