'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { cartItems } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 font-poppins">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-5 h-20 flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-green-600 tracking-wide">
          Herbolife
        </Link>

        <nav className="hidden md:flex space-x-8 font-medium text-gray-700 text-base">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4 text-gray-700 text-xl relative">
          <button onClick={() => setSearchOpen(!searchOpen)} className="hover:text-green-600">
            🔍
          </button>

          <Link href="/cart" className="relative hover:text-green-600">
  🛒
  {cartItems.length > 0 && (
    <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
      {cartItems.reduce((total, item) => total + item.quantity, 0)}
    </span>
  )}
</Link>

        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-3xl">
          ☰
        </button>
      </div>

      {searchOpen && (
        <div className="w-full max-w-screen-xl mx-auto px-4 pb-3">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search for products..."
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-green-500 text-sm"
          />
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2 font-medium text-gray-700 text-base">
          {[
            ['Home', '/'],
            ['Shop', '/shop'],
            ['Cart', '/cart'],
            ['Checkout', '/checkout'],
            ['Contact Us', '/contact'],
          ].map(([label, path]) => (
            <Link
              key={path}
              href={path}
              className="block border-b py-2"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
