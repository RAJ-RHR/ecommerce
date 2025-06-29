'use client';

import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategorySidebar from '@/components/CategorySidebar';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />

      {/* Main content area with reduced side margins */}
      <main className="mx-auto max-w-screen-xl px-2 sm:px-3 md:px-4">
        {children}
      </main>

      <Footer />

      <CategorySidebar />
    </CartProvider>
  );
}
