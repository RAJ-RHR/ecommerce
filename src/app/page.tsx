'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { FaCheckCircle, FaLeaf, FaTruck, FaUndo } from 'react-icons/fa';
import CategorySidebar from '@/components/CategorySidebar';
import Footer from '@/components/Footer';
import Image from 'next/image';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  offer_price: number;
  category: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
      setProducts(data);
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Top Features */}
      <section className="grid grid-cols-2 md:grid-cols-4 text-center py-6 border-b bg-white">
        <div>
          <FaCheckCircle size={36} className="text-green-600 mx-auto mb-2" />
          <p className="font-semibold text-sm md:text-base">100% Genuine Products</p>
        </div>
        <div>
          <FaLeaf size={36} className="text-green-600 mx-auto mb-2" />
          <p className="font-semibold text-sm md:text-base">Natural Ingredients</p>
        </div>
        <div>
          <FaTruck size={36} className="text-green-600 mx-auto mb-2" />
          <p className="font-semibold text-sm md:text-base">Fast Delivery</p>
        </div>
        <div>
          <FaUndo size={36} className="text-green-600 mx-auto mb-2" />
          <p className="font-semibold text-sm md:text-base">Easy Returns</p>
        </div>
      </section>

      {/* Sidebar + Main Content */}
      <main className="flex min-h-screen bg-gray-50">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block w-64 p-4 bg-white border-r sticky top-0 h-screen overflow-y-auto">
          <CategorySidebar />
        </aside>

        {/* Sidebar Toggle (Mobile) */}
        <div className="md:hidden p-4">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {isMobileSidebarOpen ? 'Close Categories' : 'Open Categories'}
          </button>
          {isMobileSidebarOpen && (
            <div className="mt-4 bg-white border rounded p-4">
              <CategorySidebar />
            </div>
          )}
        </div>

        {/* Main Content */}
        <section className="flex-1 p-4">
          {/* Carousel */}
          <div className="mb-6">
            <Image
              src="/banner.jpg" // Replace with your banner image
              alt="Banner"
              width={1200}
              height={300}
              className="w-full h-60 object-cover rounded-lg"
            />
          </div>

          {/* Search Bar */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Latest <span className="text-green-600">Products</span>
            </h2>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="p-2 border rounded text-sm w-64"
            />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="bg-white border rounded p-4 text-center hover:shadow-md transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-32 w-full object-contain mb-2"
                />
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-green-600 font-bold">₹{product.offer_price}</p>
                <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
