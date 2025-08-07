import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // <-- Langkah 2

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <motion.h1 whileHover={{ scale: 1.05 }} className="text-2xl font-extrabold text-blue-700 cursor-pointer tracking-tight"><svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
          Secural<span className="text-gray-900">ID</span>
          <span className="text-xs font-medium text-gray-400 ml-1.5 align-middle">community</span>
        </motion.h1>

        <ul className="hidden md:flex space-x-8 text-gray-600 font-medium text-sm">
          {[
            { label: 'Beranda', href: '/' },
            { label: 'Artikel', href: '/artikel' },
            { label: 'Secural ID', href: '/tentang' },
            { label: 'Hubungi Kami', href: '/hubungi' },
          ].map(({ label, href }) => (
            <motion.li
              key={label}
              whileHover={{ y: -2 }}
              className="cursor-pointer hover:text-blue-800 transition-colors duration-200"
            >
              <a href={href}>{label}</a>
            </motion.li>
          ))}

        </ul>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-600 hover:text-blue-700 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 pb-4 border-t border-gray-200/80"
          >
            <ul className="space-y-2 text-gray-600 font-medium mt-4">
              {['Beranda', 'Artikel', ' Secural ID', 'Hubungi Kami'].map((item) => (
                <li key={item} className="hover:text-blue-800 cursor-pointer py-2 px-2 rounded-md hover:bg-blue-50 transition-all duration-200">
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}