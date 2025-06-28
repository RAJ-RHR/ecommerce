'use client';

import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      {children}
    </CartProvider>
  );
}
