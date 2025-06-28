'use client';

import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import CategorySidebar from '@/components/CategorySidebar'; // Adjust path if needed

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      {children}
      <CategorySidebar /> {/* Sticky badge shown on all pages */}
    </CartProvider>
  );
}
