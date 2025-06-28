'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import CategorySidebar from '@/components/CategorySidebar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import type { Product } from '@/context/CartContext';

const CategoryPage = () => {
  const { slug } = useParams();
  const [categoryData, setCategoryData] = useState<Product[] | null>(null);
  const [search, setSearch] = useState('');
  const { cartItems, addToCart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const decodedSlug =
    typeof slug === 'string'
      ? decodeURIComponent(slug)
      : Array.isArray(slug) && slug.length > 0
      ? decodeURIComponent(slug[0])
      : '';

  useEffect(() => {
    if (!decodedSlug) return;
    const fetchCategoryData = async () => {
      const q = query(collection(db, 'products'), where('category', '==', decodedSlug));
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          image: data.image,
          category: data.category,
          label: data.label,
          description: data.description,
          price: Number(data.price),
          offer_price: Number(data.offer_price),
        } as Product;
      });
      setCategoryData(products);
    };

    fetchCategoryData();
  }, [decodedSlug]);

  const filtered = categoryData?.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDecreaseQty = (product: Product) => {
    const inCart = cartItems.find(item => item.id === product.id);
    if (inCart && inCart.quantity > 1) {
      decreaseQty(product.id);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <div>
      <main className="flex flex-col md:flex-row">
        <div className="md:w-1/5 p-4 border-r">
          <CategorySidebar setCategory={setSearch} />
        </div>

        <div className="md:w-4/5 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-1/3 p-2 border rounded text-sm"
            />
          </div>

          <h1 className="text-2xl font-semibold mb-4">Category: {decodedSlug}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filtered?.map((product) => {
              const inCart = cartItems.find((item) => item.id === product.id);

              return (
                <div key={product.id} className="border rounded-lg shadow-sm p-4 text-center relative group">
                  <Link href={`/products/${product.id}`}>
                    <div className="cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-40 w-full object-contain bg-white p-2 rounded mb-2"
                      />
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-green-600 font-bold text-lg">₹{product.offer_price}</p>
                      <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
                    </div>
                  </Link>

                  {inCart ? (
                    <>
                      <div className="mt-2 flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleDecreaseQty(product)}
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
                        className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                      >
                        Go to Cart
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => addToCart(product)} // ✅ clean and typed
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mt-2"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
