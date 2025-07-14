"use client";

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'

const navLinks = [
  { label: 'Главная', to: 'top' },
  { label: 'О компании', to: 'about' },
  { label: 'Преимущества', to: 'benefits' },
  { label: 'Как мы работаем', to: 'process' },
  
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const router = useRouter();

  // Плавный скролл к секции
  const handleScroll = (id: string) => {
    setIsOpen(false);
    if (!isHome) {
      // Сначала переходим на главную страницу
      router.push('/');
      // После перехода ждем загрузки страницы и скроллим к секции
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Обработчик клика по кнопке "Оставить заявку"
  const handleApplyClick = () => {
    setIsOpen(false);
    if (!isHome) {
      // Сначала переходим на главную страницу
      router.push('/');
      // После перехода ждем загрузки страницы и скроллим к секции CTA
      setTimeout(() => {
        const ctaSection = document.getElementById('cta');
        if (ctaSection) {
          ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      return;
    }
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  // Обработка хэша в URL при загрузке страницы
  useEffect(() => {
    if (isHome) {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    }
  }, [isHome]);

  return (
    <>
      <header className="w-full bg-black/80 backdrop-blur sticky top-0 z-30 shadow-md py-0">
        <nav className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl focus:outline-none" aria-label="Flow.Capital">
            <Image
              src="/uploads/20250702_1736_Flow. Capital Logo_simple_compose_01jz5s1dttejqsh8w0435jgzra.png"
              alt="Flow.Capital Logo"
              width={60}
              height={60}
              className=""
              priority
            />
            Flow.Capital
          </Link>
          {/* Desktop nav */}
          <div className="hidden lg:flex gap-6 items-center">
            {navLinks.map(link => (
              <button
                key={link.to}
                onClick={() => handleScroll(link.to)}
                className="text-white hover:text-blue-400 transition-colors px-1 py-1 rounded focus:outline-none whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={handleApplyClick}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow focus:outline-none flex-shrink-0 whitespace-nowrap"
            >
              Оставить заявку
            </button>
          </div>
          {/* Hamburger */}
          <button
            className="lg:hidden text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsOpen(true)}
            aria-label="Открыть меню"
          >
            <Bars3Icon className="h-7 w-7" />
          </button>
        </nav>
      </header>
      {/* Мобильное меню вне хедера */}
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
                <Image
                  src="/uploads/20250702_1736_Flow. Capital Logo_simple_compose_01jz5s1dttejqsh8w0435jgzra.png"
                  alt="Flow.Capital Logo"
                  width={60}
                  height={40}
                  className=""
                  priority
                />
                Flow.Capital
              </div>
              <div className="flex flex-col gap-3 mt-4">
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
                  onClick={handleApplyClick}
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow"
                >
                  Оставить заявку
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 