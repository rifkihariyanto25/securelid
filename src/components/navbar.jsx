import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import supabase from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Get user profile from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', session.user.id)
          .single();
        
        setUser({
          ...session.user,
          username: profile?.username || profile?.full_name || session.user.email
        });
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', session.user.id)
          .single();
        
        setUser({
          ...session.user,
          username: profile?.username || profile?.full_name || session.user.email
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsDropdownOpen(false);
    router.push('/');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/80 backdrop-blur-lg shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-200/80"
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

        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8 text-gray-600 font-medium text-sm">
            {[
              { label: 'Beranda', href: '/' },
              { label: 'Artikel', href: '/artikelpage' },
              { label: 'Tentang Kami', href: '/tentang' },
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
          
          {user ? (
            <div className="relative">
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                <div className="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center text-xs">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
                <span>{user.username}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50"
                  >
                    <div className="py-1">
                      <a href="/artikel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </a>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.a 
              href="/login"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 inline-block"
            >
              Login
            </motion.a>
          )}
        </div>

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
              {[
                { label: 'Beranda', href: '/' },
                { label: 'Artikel', href: '/artikelpage' },
                { label: 'Tentang Kami', href: '/tentang' },
                { label: 'Hubungi Kami', href: '/hubungi' },
              ].map(({ label, href }) => (
                <li key={label} className="hover:text-blue-800 cursor-pointer py-2 px-2 rounded-md hover:bg-blue-50 transition-all duration-200">
                  <a href={href}>{label}</a>
                </li>
              ))}
              <li className="mt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 px-2 py-2 bg-blue-50 rounded-md">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-gray-700 font-medium">{user.username}</span>
                    </div>
                    <a href="/artikel" className="block bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 w-full rounded-md transition-colors duration-200 text-center">
                      Dashboard
                    </a>
                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 w-full rounded-md transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 w-full rounded-md transition-colors duration-200 inline-block text-center">
                    Login
                  </a>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}