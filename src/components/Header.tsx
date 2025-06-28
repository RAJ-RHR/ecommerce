'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { FaBars, FaSearch, FaShoppingCart } from 'react-icons/fa';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { totalQuantity, totalAmount } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 font-poppins">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-4 h-24 flex items-center justify-between">
        
        {/* Mobile menu icon */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-xl text-gray-700">
          <FaBars />
        </button>

        {/* Logo (Image) */}
        <Link href="/" className="flex items-center space-x-2">
  <img
    src="/logo.png"
    alt="Herbolife Logo"
    className="h-24 w-auto transition-transform duration-200 hover:scale-105"
  />
</Link>


        {/* Desktop menu */}
        <nav className="hidden md:flex space-x-8 font-medium text-gray-700 text-base">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>

        {/* Right icons */}
        <div className="flex items-center space-x-3 text-gray-700 text-xl relative -translate-x-2">
          {/* Search */}
          <button onClick={() => setSearchOpen(!searchOpen)} className="hover:text-green-600">
            <FaSearch />
          </button>

          {/* Cart and Amount */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Link href="/cart">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition">
                  <FaShoppingCart />
                </div>
              </Link>

              {/* Quantity Badge */}
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </div>

            {/* Amount */}
            {totalQuantity > 0 && (
              <div className="text-[13px] text-gray-700 font-bold min-w-[60px] text-right">
                ₹{totalAmount.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
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

      {/* Mobile Menu */}
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
