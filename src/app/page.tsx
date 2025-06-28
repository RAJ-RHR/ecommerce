'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheckCircle, FaLeaf, FaTruck, FaUndo } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import Footer from '@/components/Footer';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  offer_price: number;
  category: string;
  label?: string;
  description?: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const { cartItems, addToCart, increaseQty, decreaseQty } = useCart();

  const banners = ['/images/banner1.jpg', '/images/banner2.jpg'];

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getLabelColor = (label: string | undefined) => {
    if (label === 'Hot Deal') return 'bg-red-600';
    if (label === 'Sale') return 'bg-green-600';
    if (label === 'Limited Offer') return 'bg-orange-500';
    return '';
  };

  const renderProductCard = (product: Product) => {
    const inCart = cartItems.find((item) => item.id === product.id);

    return (
      <div key={product.id} className="relative bg-white rounded-2xl shadow p-4 hover:shadow-lg transition">
        {product.label && (
          <span className={`absolute top-2 left-2 text-xs text-white px-2 py-1 rounded ${getLabelColor(product.label)}`}>
            {product.label}
          </span>
        )}
        <Link href={`/products/${product.id}`}>
          <div className="overflow-hidden rounded-xl mb-2">
            <img
              src={product.image}
              alt={product.name}
              className="h-40 w-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>
          <h3 className="font-semibold text-sm">{product.name}</h3>
          <p className="text-green-600 font-bold text-sm">₹{product.offer_price}</p>
          <p className="text-gray-500 line-through text-xs">₹{product.price}</p>
        </Link>
        <div className="mt-2">
          {inCart ? (
            <>
              <div className="flex justify-center items-center gap-2">
                <button onClick={() => decreaseQty(product.id)} className="bg-gray-200 px-2 rounded">-</button>
                <span>{inCart.quantity}</span>
                <button onClick={() => increaseQty(product.id)} className="bg-gray-200 px-2 rounded">+</button>
              </div>
              <Link
                href="/cart"
                className="block mt-2 text-sm text-center bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              >
                View Cart
              </Link>
            </>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="bg-green-600 text-white px-3 py-1 rounded mt-2 text-sm hover:bg-green-700"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Banner Carousel */}
      <div className="px-4 md:px-8 mt-4 mb-6 relative w-full h-56 md:h-72 rounded-lg overflow-hidden">
        {banners.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`Banner ${index}`}
            width={1200}
            height={300}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}
      </div>

      {/* Features */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-y-6 px-4 md:px-16 text-center py-6 border-b bg-white">
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

      {/* Product Grid */}
      <main className="bg-gray-50 px-4 md:px-8 py-6">
        <h2 className="text-2xl font-bold mb-6">
          Latest <span className="text-green-600">Products</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map(renderProductCard)}
        </div>
      </main>

      <Footer />
    </>
  );
}
