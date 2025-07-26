'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { FaBars, FaSearch, FaShoppingCart } from 'react-icons/fa';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Product } from '@/context/CartContext';

type ProductWithSlug = Product & { slug: string };

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [allProducts, setAllProducts] = useState<ProductWithSlug[]>([]);
  const { totalQuantity, totalAmount } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      const products = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (!data.slug) return null; // Skip products without slug
          return {
            id: doc.id,
            name: data.name,
            image: data.image,
            category: data.category,
            label: data.label,
            description: data.description || '',
            price: Number(data.price),
            offer_price: Number(data.offer_price),
            slug: data.slug,
          } as ProductWithSlug;
        })
    .filter((item): item is ProductWithSlug => item !== null); // ✅ safe and typed
      setAllProducts(products);
    };

    fetchProducts();
  }, []);

  const filtered =
    searchValue.trim() === ''
      ? []
      : allProducts.filter((product) =>
          (product.name + product.category)
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 font-poppins">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-4 h-24 flex items-center justify-between">
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-xl text-gray-700">
          <FaBars />
        </button>

        <Link href="/" className="flex items-center space-x-2">
          <img
            src="https://res.cloudinary.com/deijswbt1/image/upload/v1753527333/logo_sayg6g.png"
            alt="Herbolife Logo"
            className="h-24 w-auto transition-transform duration-200 hover:scale-105"
          />
        </Link>

        <nav className="hidden md:flex space-x-8 font-medium text-gray-700 text-base">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/checkout">Checkout</Link>
          <Link href="/contact">Contact Us</Link>
        </nav>

        <div className="flex items-center space-x-3 text-gray-700 text-xl relative -translate-x-2">
          <button onClick={() => setSearchOpen(!searchOpen)} className="hover:text-green-600">
            <FaSearch />
          </button>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Link href="/cart">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-200 transition">
                  <FaShoppingCart />
                </div>
              </Link>
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </div>
            {totalQuantity > 0 && (
              <div className="text-[13px] text-gray-700 font-bold min-w-[60px] text-right">
                ₹{totalAmount.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="relative w-full max-w-screen-xl mx-auto px-4 pb-4">
          <div className="w-full md:w-1/2 mx-auto relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by name or category..."
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-green-500 text-sm"
            />
            {filtered.length > 0 && (
              <div className="absolute z-50 w-full bg-white mt-1 border rounded shadow max-h-72 overflow-y-auto">
                {filtered.map((product) => (
                  <Link
                    href={`/products/${product.slug}`}
                    key={product.id}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchValue('');
                    }}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-green-50 border-b"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-contain"
                    />
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2 font-medium text-gray-700 text-base">
          {[['Home', '/'], ['Shop', '/shop'], ['Cart', '/cart'], ['Checkout', '/checkout'], ['Contact Us', '/contact']].map(
            ([label, path]) => (
              <Link
                key={path}
                href={path}
                className="block border-b py-2"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
