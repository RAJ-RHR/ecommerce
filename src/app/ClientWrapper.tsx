'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategorySidebar from '@/components/CategorySidebar';
import MobileNav from '@/components/MobileNav';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (window !== window.parent) {
      window.parent.postMessage(
        {
          title: document.title,
          path: pathname,
          url: window.location.href,
        },
        '*'
      );
    }
  }, [pathname]);

  return (
    <CartProvider>
      <Header />

      <main className="mx-auto max-w-screen-xl px-2 sm:px-3 md:px-4 pb-24">
        {children}
      </main>

      <Footer />
      <CategorySidebar />
      <MobileNav />
    </CartProvider>
  );
}
