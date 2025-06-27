'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
  offer_price: string;
  category: string;
  quantity?: number;
};

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const {
    cartItems,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || typeof id !== 'string') return;

      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { id: _id, ...data } = docSnap.data() as Product;
        setProduct({ id: docSnap.id, ...data });
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Product not found</div>;

  const inCart = cartItems.find((item) => item.id === product.id);

  const handleDecrease = () => {
    if (inCart && inCart.quantity > 1) {
      decreaseQty(product.id);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col md:flex-row">
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
              <p className="text-lg text-gray-600 mb-2">
                Category: {product.category}
              </p>
              <p className="text-xl text-red-500 line-through mb-1">
                ₹{product.price}
              </p>
              <p className="text-2xl font-bold text-green-600 mb-4">
                ₹{product.offer_price}
              </p>

              {inCart ? (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={handleDecrease}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span>{inCart.quantity}</span>
                    <button
                      onClick={() => increaseQty(product.id)}
                      className="px-3 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  <Link
                    href="/cart"
                    className="inline-block mt-2 bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
                  >
                    Go to Cart
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => addToCart({ ...product, quantity: 1 })}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
