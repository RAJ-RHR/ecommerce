'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-green-600">
          Herbolife
        </Link>

        <nav className="hidden md:flex space-x-6 font-medium text-gray-700">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/contact">Contact Us</Link>
          {/* <Link href="/account">My Account</Link> */}
          {/* <Link href="/track-order">Order Tracking</Link> */}
        </nav>

        <div className="hidden md:flex space-x-4 text-gray-600 text-xl">
          <button>🔍</button>
          <button>❤️</button>
          <Link href="/cart">🛒</Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2">
          {[
            ['Home', '/'],
            ['Shop', '/shop'],
            ['Cart', '/cart'],
            ['Checkout', '/checkout'],
            ['Contact Us', '/contact'],
            // ['My Account', '/account'],
            // ['Order Tracking', '/track-order'],
          ].map(([label, path]) => (
            <Link
              key={path}
              href={path}
              className="block border-b py-2 text-gray-700 font-medium"
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
