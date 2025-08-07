"use client";

import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Lottie from 'lottie-react';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';
import NaratorPlayer from '../../components/naratorplayer';
import BacksoundPlayer from '../../components/backsoundplayer';
// Temporarily comment out animation import until we fix the path
// import talkingAnimation from '/animations/talking-animation.json';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';





const CheckIcon = () => (
    <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const BookIcon = () => (
    <svg className="w-6 h-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);
const SparklesIcon = () => (
    <svg className="w-6 h-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M16 17v4m-2-2h4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-6.364-2.364l.707.707M16.071 4.929l.707.707m-12.728 0l-.707.707M17.486 16.778l-.707.707" />
    </svg>
);


export default function Home() {

    const handleScrollDown = () => {
        const nextSection = document.getElementById('features-section');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const anggota = [
        { nama: 'Joshua Barani', Jobdeks: 'Kordinator Projek', asal: 'Aki University', foto: '/anggota/joshua.jpg' },
        { nama: 'Yosia Agus Permana', Jobdeks: 'Frontend', asal: 'Aki University', foto: '/anggota/Yosia.jpg' },
        { nama: 'Hendrik Prayoga', Jobdeks: 'UI/UX', asal: 'Telkom University', foto: '/anggota/Hendrik.jpg' },
        { nama: 'Muhamad Dimas Nurzaky', Jobdeks: 'UI/UX', asal: 'Telkom University', foto: '/anggota/Dimas.jpg' },
        { nama: 'Rifki Aditya Hariyanto', Jobdeks: 'Backend', asal: 'Telkom University', foto: '/anggota/Rifki.jpg' },
        { nama: 'Arif Pramudia wardana', Jobdeks: 'Backend', asal: 'Telkom University', foto: '/anggota/Arif.jpg' },
        { nama: 'Irgi', Jobdeks: 'Bantu Kordinator', asal: 'Universitas Aki', foto: '/anggota/Irgi.jpg' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <div className="font-sans bg-blue-600 text-white overflow-x-hidden antialiased">
            <Navbar />
            <NaratorPlayer />
            <BacksoundPlayer />

            {/* ... KONTEN HALAMAN ... */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src="/Gradient Preview.png" alt="Gradient Background" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff66_1px,transparent_1px)] [background-size:20px_20px]" />
                <div className="absolute top-20 right-20 w-40 h-40 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-white/10 blur-3xl"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 space-y-6">
                        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter leading-tight">
                            <span className="block text-white drop-shadow-lg">Yuk, Melek Keamanan Digital Bareng!</span>
                            <span className="block mt-3 text-white drop-shadow-lg">
                                SecuralID
                            </span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-white drop-shadow-md max-w-lg mx-auto md:mx-0 text-base md:text-lg">
                            SecuralID hadir sebagai komunitas terbuka yang menyebarkan literasi keamanan digital demi menciptakan ruang online yang lebih aman dan inklusif.
                        </motion.p>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all duration-300 border-2 border-blue-200">
                                Jelajahi Artikel
                            </motion.button>
                        </motion.div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: "circOut", delay: 0.3 }} className="flex-1">
                        <svg width="100%" height="100%" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto">
                            <g transform="translate(400, 300)">
                                {/* Pahlawan Digital dengan Kostum Tradisional */}
                                <g>
                                    {/* Siluet Pahlawan */}
                                    <path d="M-150,-50 C-130,-120 130,-120 150,-50 L120,200 L-120,200 Z" fill="#0284c7" stroke="white" strokeWidth="2" />
                                    
                                    {/* Kepala */}
                                    <circle cx="0" cy="-150" r="70" fill="#0284c7" stroke="white" strokeWidth="2" />
                                    
                                    {/* Mahkota/Headpiece */}
                                    <path d="M-60,-200 L0,-250 L60,-200" stroke="white" strokeWidth="4" fill="none" />
                                    <path d="M-40,-200 L0,-230 L40,-200" stroke="white" strokeWidth="3" fill="none" />
                                    
                                    {/* Simbol Keamanan */}
                                    <rect x="-30" y="-30" width="60" height="80" rx="10" fill="white" />
                                    <circle cx="0" cy="-5" r="15" fill="#0284c7" stroke="white" strokeWidth="2" />
                                    <path d="M0,-15 L0,5" stroke="white" strokeWidth="4" />
                                    
                                    {/* Perisai */}
                                    <path d="M-100,50 L-80,30 L80,30 L100,50 L80,150 L0,200 L-80,150 Z" fill="#0369a1" stroke="white" strokeWidth="2" />
                                    <path d="M-50,70 L50,70 L30,150 L0,180 L-30,150 Z" fill="white" opacity="0.3" />
                                    
                                    {/* Simbol @ */}
                                    <circle cx="0" cy="100" r="30" fill="none" stroke="white" strokeWidth="4" />
                                    <path d="M15,100 C15,108 8,115 0,115 C-8,115 -15,108 -15,100 C-15,92 -8,85 0,85 C8,85 15,92 15,100 Z" fill="none" stroke="white" strokeWidth="4" />
                                    <path d="M15,100 L30,100" stroke="white" strokeWidth="4" />
                                </g>
                            </g>
                        </svg>
                    </motion.div>
                </div>
                <motion.div onClick={handleScrollDown} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-blue-200 flex flex-col items-center cursor-pointer" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <span className="text-sm mb-2">Scroll untuk lanjut</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </section>

            <section id="features-section" className="py-24 sm:py-32 relative overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_35px,rgba(59,130,246,0.08)_35px,rgba(59,130,246,0.08)_37px)]"></div>
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-blue-600 mb-12">
                        Kenapa Harus <span className="text-blue-800">SecuralID</span>?
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left mt-10">
                        <div className="group bg-blue-50 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 border border-blue-200">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <h4 className="text-xl font-semibold text-blue-800 mt-4 mb-2">Ringkas & Mudah Dipahami</h4>
                            <p className="text-blue-600">Membantu masyarakat melindungi data pribadi agar tidak jadi korban kejahatan digital.</p>
                        </div>
                        <div className="group bg-blue-50 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 border border-blue-200">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h4 className="text-xl font-semibold text-blue-800 mt-4 mb-2">Profesional & Relevan</h4>
                            <p className="text-blue-600">Solusi edukatif di tengah rendahnya kesadaran masyarakat terhadap keamanan dan privasi online.</p>
                        </div>
                        <div className="group bg-blue-50 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300 border border-blue-200">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M16 17v4m-2-2h4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m-6.364-2.364l.707.707M16.071 4.929l.707.707m-12.728 0l-.707.707M17.486 16.778l-.707.707" />
                            </svg>
                            <h4 className="text-xl font-semibold text-blue-800 mt-4 mb-2">Menggugah & Inspiratif</h4>
                            <p className="text-blue-600">Di era digital, data bisa dicuri dalam hitungan detik — SecuralID hadir untuk melindungi semua orang.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 relative bg-blue-600">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute h-px w-full"
                                style={{
                                    top: `${i * 7}%`,
                                    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent)`,
                                    transform: `rotate(${i % 2 === 0 ? 3 : -3}deg)`,
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl font-bold text-white mb-4"
                        >
                            Tim <span className="text-white font-extrabold">Profesional</span> Kami
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-lg text-white max-w-3xl mx-auto"
                        >
                            Tim ahli yang berdedikasi untuk memberikan solusi keamanan digital terbaik bagi Anda
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="px-4 md:px-10"
                    >
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={30}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            pagination={{ clickable: true }}
                            navigation={true}
                            breakpoints={{
                                640: { slidesPerView: 1, spaceBetween: 20 },
                                768: { slidesPerView: 2, spaceBetween: 30 },
                                1024: { slidesPerView: 3, spaceBetween: 40 },
                            }}
                            className="mySwiper"
                        >
                            {anggota.map((orang, index) => (
                                <SwiperSlide key={index}>
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:scale-90 h-full flex flex-col">
                                        <div className="h-80 overflow-hidden">
                                            <img
                                                src={orang.foto}
                                                alt={orang.nama}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-6 bg-blue-50 text-center flex-grow">
                                            <h3 className="text-lg font-semibold text-blue-800">{orang.nama}</h3>
                                            <p className="text-blue-600 font-medium mt-1">{orang.Jobdeks}</p>
                                            <p className="text-sm text-blue-500 italic mt-2">{orang.asal}</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                </div>
            </section>

            {/* ANimasi oragng bicara - dinonaktifkan sementara */}
            {/* <motion.div
                className="fixed bottom-4 left-4 z-50 w-52 pointer-events-none"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 1,
                    duration: 0.8, // Durasi animasi
                    ease: "easeOut"
                }}
            >
                <Lottie
                    animationData={talkingAnimation}
                    loop={true}
                />
            </motion.div> */}

            <Footer />
        </div>
    );
}