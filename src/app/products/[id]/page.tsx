'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where, limit } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Product } from '@/context/CartContext';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const { cartItems, addToCart, increaseQty, decreaseQty, removeFromCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || typeof id !== 'string') return;

      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const fetchedProduct = {
          id: docSnap.id,
          name: data.name,
          image: data.image,
          category: data.category,
          label: data.label,
          description: data.description || 'Ayurvedic Product',
          price: Number(data.price),
          offer_price: Number(data.offer_price),
        };
        setProduct(fetchedProduct);
        fetchRelated(fetchedProduct.category, docSnap.id);
      }
    };

    const fetchRelated = async (category: string, excludeId: string) => {
      const q = query(collection(db, 'products'), where('category', '==', category), limit(4));
      const snapshot = await getDocs(q);
      const relatedProducts = snapshot.docs
        .filter(doc => doc.id !== excludeId)
        .map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
      setRelated(relatedProducts);
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

  const getLabelColor = (label: string | undefined) => {
    if (label === 'Hot Deal') return 'bg-red-600';
    if (label === 'Sale') return 'bg-green-600';
    if (label === 'Limited Offer') return 'bg-orange-500';
    return 'bg-gray-500';
  };

  return (
    <>
      <div className="mt-20">
        <main className="flex flex-col md:flex-row">
          <section className="md:w-4/5 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group overflow-hidden shadow hover:shadow-xl transition-shadow duration-300 bg-white p-4 rounded">
                {product.label && (
                  <span className={`absolute top-2 left-2 text-xs text-white px-2 py-1 rounded ${getLabelColor(product.label)}`}>
                    {product.label}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold mb-2 text-center md:text-left">{product.name}</h1>
                <p className="text-lg text-gray-600 mb-2 text-center md:text-left">
                  Category: {product.category}
                </p>
                <div className="text-center md:text-left flex justify-center md:justify-start items-center gap-3 mb-4">
                  <p className="text-xl text-gray-500 line-through">₹{product.price}</p>
                  <p className="text-2xl font-bold text-green-600">₹{product.offer_price}</p>
                </div>

                {inCart ? (
                  <>
                    <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                      <button
                        onClick={handleDecrease}
                        className="px-3 py-1 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span>{inCart.quantity}</span>
                      <button
                        onClick={() => increaseQty(product.id)}
                        className="px-3 py-1 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-center md:text-left">
                      <Link
                        href="/cart"
                        className="inline-block border border-blue-600 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50"
                      >
                        Go to Cart
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center md:text-left">
                    <button
                      onClick={() => addToCart(product)}
                      className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-50"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}

                <p className="text-sm text-gray-700 mt-4 text-center md:text-left">
                  {product.description}
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {related.length > 0 && (
        <section className="p-6">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex md:grid md:grid-cols-4 gap-4 min-w-[600px]">
              {related.map((item) => (
                <Link
                  href={`/products/${item.id}`}
                  key={item.id}
                  className="min-w-[45%] md:min-w-0 border rounded-lg p-4 shadow hover:shadow-lg transition duration-300 text-center"
                >
                  <div className="overflow-hidden rounded mb-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-40 w-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-base mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 mb-1">Category: {item.category}</p>
                  <div className="flex justify-center items-center gap-2">
                    <p className="text-sm line-through text-gray-400">₹{item.price}</p>
                    <p className="text-green-600 font-bold text-lg">₹{item.offer_price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      
    </>
  );
}
