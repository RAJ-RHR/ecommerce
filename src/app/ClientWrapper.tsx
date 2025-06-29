'use client';

import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategorySidebar from '@/components/CategorySidebar';
import MobileNav from '@/components/MobileNav';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
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
