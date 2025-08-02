import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  title: "Artikel Management",
  description: "Aplikasi manajemen artikel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6">
              {/* Header removed to eliminate Dashboard text */}
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
