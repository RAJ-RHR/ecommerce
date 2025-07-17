'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import type { Product } from '@/context/CartContext';

// Extend Product to include slug
type ProductWithSlug = Product & { slug: string };

const CategoryPage = () => {
  const { slug } = useParams();
  const [categoryData, setCategoryData] = useState<ProductWithSlug[]>([]);
  const [search, setSearch] = useState('');
  const [allCategories, setAllCategories] = useState<{ [key: string]: Product }>({});
  const [mounted, setMounted] = useState(false);
  const { cartItems, addToCart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const decodedSlug =
    typeof slug === 'string'
      ? decodeURIComponent(slug)
      : Array.isArray(slug) && slug.length > 0
      ? decodeURIComponent(slug[0])
      : '';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!decodedSlug) return;

    const fetchCategoryData = async () => {
      const q = query(collection(db, 'products'), where('category', '==', decodedSlug));
      const snapshot = await getDocs(q);
      const products: ProductWithSlug[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          slug: data.slug, // ensure 'slug' exists in Firestore
          name: data.name,
          image: data.image,
          category: data.category,
          label: data.label,
          description: data.description,
          price: Number(data.price),
          offer_price: Number(data.offer_price),
        };
      });
      setCategoryData(products);
    };

    const fetchAllCategories = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      const randomByCategory: { [key: string]: Product } = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!randomByCategory[data.category]) {
          randomByCategory[data.category] = {
            id: doc.id,
              slug: data.slug, // ✅ Add this line
            name: data.name,
            image: data.image,
            category: data.category,
            label: data.label,
            description: data.description,
            price: Number(data.price),
            offer_price: Number(data.offer_price),
          };
        }
      });
      setAllCategories(randomByCategory);
    };

    fetchCategoryData();
    fetchAllCategories();
  }, [decodedSlug]);

  if (!mounted) return null;

  const filtered = categoryData?.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDecreaseQty = (product: ProductWithSlug) => {
    const inCart = cartItems.find((item) => item.id === product.id);
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
    <div className="mt-20">
      <main className="p-4">
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

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((product) => {
              const inCart = cartItems.find((item) => item.id === product.id);

              return (
                <div
                  key={product.id}
                  className="border rounded-lg shadow-sm p-4 text-center relative group hover:shadow-md"
                >
                  {product.label && (
                    <span
                      className={`absolute top-2 left-2 z-20 text-xs text-white px-2 py-1 rounded ${getLabelColor(
                        product.label
                      )}`}
                    >
                      {product.label}
                    </span>
                  )}

                  <Link href={`/products/${product.slug}`}>
                    <div className="cursor-pointer">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-40 w-full object-contain bg-white p-2 rounded mb-2 group-hover:scale-105 transition-transform"
                      />
                      <h3 className="text-base font-semibold mb-1">{product.name}</h3>
                      <div className="flex justify-center items-center gap-2">
                        <p className="text-sm line-through text-gray-400">
                          ₹{product.price.toFixed(2)}
                        </p>
                        <p className="text-green-600 font-bold text-lg">
                          ₹{product.offer_price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Link>

                  {inCart ? (
                    <>
                      <div className="mt-2 flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleDecreaseQty(product)}
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
                      <Link
                        href="/cart"
                        className="inline-block mt-2 border border-blue-600 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50"
                      >
                        Go to Cart
                      </Link>
                    </>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-50 mt-2"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found in this category.</p>
        )}
      </main>

      {/* Shop by Category Section */}
      {Object.keys(allCategories).length > 0 && (
       <section className="w-full mt-12 mb-8 px-4 md:px-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            SHOP BY <span className="text-green-600">CATEGORY</span>
          </h2>
          <div className="flex overflow-x-auto flex-nowrap gap-4 hide-scrollbar">
            {Object.entries(allCategories).map(([category, product]) => (
              <Link
                href={`/category/${category}`}
                key={category}
                className="min-w-[45%] md:min-w-0 bg-white rounded-2xl shadow p-4 flex-shrink-0 hover:shadow-xl transition duration-300 text-center"
              >
                <div className="overflow-hidden rounded-lg mb-2 transition-transform duration-300 hover:scale-105">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-sm text-center">{category}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CategoryPage;