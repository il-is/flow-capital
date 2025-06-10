"use client";

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Главная', to: 'top' },
  { label: 'О компании', to: 'about' },
  { label: 'Условия сотрудничества', to: 'terms' },
  { label: 'Наши услуги', to: 'services' },
  { label: 'Преимущества', to: 'benefits' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Плавный скролл к секции
  const handleScroll = (id: string) => {
    setIsOpen(false);
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // При открытии/закрытии мобильного меню блокируем скролл
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <header className="w-full bg-black/80 backdrop-blur sticky top-0 z-30 shadow-md">
      <nav className="container mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl focus:outline-none" aria-label="Flow.Capital">
          {/* Минималистичный flow-логотип */}
          <span className="text-blue-400" aria-hidden>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 18C6 22 12 22 15 18C18 14 22 14 25 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 10C6 6 12 6 15 10C18 14 22 14 25 10" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Flow.Capital
        </Link>
        {/* Desktop nav */}
        {isHome ? (
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map(link => (
              <button
                key={link.to}
                onClick={() => handleScroll(link.to)}
                className="text-white hover:text-blue-400 transition-colors px-2 py-1 rounded focus:outline-none"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleScroll('cta')}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow focus:outline-none"
            >
              Оставить заявку
            </button>
          </div>
        ) : (
          <div className="hidden md:block">
            <Link href="/" className="text-white hover:text-blue-400 transition-colors px-4 py-2 rounded focus:outline-none">
              На главную
            </Link>
          </div>
        )}
        {/* Hamburger */}
        <button
          className="md:hidden text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setIsOpen(true)}
          aria-label="Открыть меню"
        >
          <Bars3Icon className="h-7 w-7" />
        </button>
        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex"
            >
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black"
                onClick={() => setIsOpen(false)}
              />
              {/* Menu */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="ml-auto w-full sm:w-3/4 max-w-xs bg-gray-900 h-full shadow-xl flex flex-col p-4 gap-4 relative z-50 overflow-y-auto"
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  onClick={() => setIsOpen(false)}
                  aria-label="Закрыть меню"
                >
                  <XMarkIcon className="h-7 w-7" />
                </button>
                <div className="flex items-center gap-2 text-white font-bold text-xl mb-4 mt-2">
                  <span className="text-blue-400">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 18C6 22 12 22 15 18C18 14 22 14 25 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 10C6 6 12 6 15 10C18 14 22 14 25 10" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  Flow.Capital
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  {isHome ? (
                    <>
                      {navLinks.map(link => (
                        <button
                          key={link.to}
                          onClick={() => handleScroll(link.to)}
                          className="text-white text-base hover:text-blue-400 transition-colors text-left py-2"
                        >
                          {link.label}
                        </button>
                      ))}
                      <button
                        onClick={() => handleScroll('cta')}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow"
                      >
                        Оставить заявку
                      </button>
                    </>
                  ) : (
                    <Link href="/" className="text-white text-base hover:text-blue-400 transition-colors text-left py-2">
                      На главную
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
} 