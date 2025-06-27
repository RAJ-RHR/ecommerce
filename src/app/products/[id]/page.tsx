'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategorySidebar from '@/components/CategorySidebar';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  offer_price: number;
  category: string;
};

type CartItem = Product & { quantity: number };

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || typeof id !== 'string') return;

      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...(docSnap.data() as Product) });
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const addToCart = () => {
    let cart: CartItem[] = [];

    try {
      const stored = localStorage.getItem('cart');
      if (stored) cart = JSON.parse(stored);
    } catch (err) {
      console.warn('🛒 Invalid cart found in localStorage. Resetting.');
      cart = [];
    }

    const exists = cart.find((item) => item.id === product?.id);
    if (exists) {
      exists.quantity += 1;
    } else if (product) {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('✅ Added to cart');
  };

  if (loading) return <div className="p-6">⏳ Loading product...</div>;
  if (!product) return <div className="p-6 text-red-600">❌ Product not found</div>;

  return (
    <>
      <Header />

      <main className="flex flex-col md:flex-row">
        <aside className="md:w-1/5 p-4 border-r">
          <CategorySidebar />
        </aside>

        <section className="md:w-4/5 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-contain bg-white"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-gray-600 mb-2">Category: {product.category}</p>
              <p className="text-xl text-red-500 line-through mb-1">₹{product.price}</p>
              <p className="text-2xl font-bold text-green-600 mb-4">₹{product.offer_price}</p>
              <button
                onClick={addToCart}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
