'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheckCircle, FaLeaf, FaTruck, FaUndo } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  offer_price: number;
  category: string;
  label?: string;
  description?: string;
 slug: string; // <-- make this required
};
export const revalidate = 3600; // revalidate every hour

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [randomCategoryProducts, setRandomCategoryProducts] = useState<{ category: string; product: Product }[]>([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const { cartItems, addToCart, increaseQty, decreaseQty } = useCart();

  const banners = ['/images/banner1.jpg', '/images/banner2.jpg'];

  useEffect(() => {
    const fetchProducts = async () => {
      const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const raw = doc.data();
        return {
          id: doc.id,
          ...raw,
          price: Number(raw.price),
          offer_price: Number(raw.offer_price),
        };
      }) as Product[];
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

  useEffect(() => {
    if (products.length === 0) return;

    const categoryMap: Record<string, Product[]> = {};
    products.forEach((p) => {
      if (!categoryMap[p.category]) categoryMap[p.category] = [];
      categoryMap[p.category].push(p);
    });

    const selections = Object.entries(categoryMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, items]) => ({
        category,
        product: items[Math.floor(Math.random() * items.length)],
      }));

    setRandomCategoryProducts(selections);
  }, [products]);

  const getLabelColor = (label: string | undefined) => {
    if (label === 'Hot Deal') return 'bg-red-600';
    if (label === 'Sale') return 'bg-green-600';
    if (label === 'Limited Offer') return 'bg-orange-500';
    return '';
  };

  const renderProductCard = (product: Product) => {
    const inCart = cartItems.find((item) => item.id === product.id);
    const productSlugLink = product.slug ? `/products/${product.slug}` : `/products/${product.id}`;

    return (
      <div
        key={product.id}
        className="relative bg-white rounded-2xl shadow p-4 hover:shadow-xl transition duration-300"
      >
        {product.label && (
          <span className={`absolute top-2 left-2 z-20 text-xs text-white px-2 py-1 rounded ${getLabelColor(product.label)}`}>
            {product.label}
          </span>
        )}
        <Link href={productSlugLink}>
          <div className="overflow-hidden rounded-xl mb-2 transition-transform duration-300 hover:scale-105">
            <img
              src={product.image}
              alt={product.name}
              className="h-40 w-full object-contain"
            />
          </div>
          <h3 className="font-semibold text-base text-center mb-1">{product.name}</h3>
          <div className="text-center flex justify-center items-center gap-2">
            <p className="text-gray-500 line-through text-sm">₹{product.price.toFixed(2)}</p>
            <p className="text-green-600 font-bold text-lg">₹{product.offer_price.toFixed(2)}</p>
          </div>
        </Link>

        <div className="mt-3">
          {inCart ? (
            <>
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => decreaseQty(product.id)}
                  className="border border-gray-400 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-100 transition"
                >
                  −
                </button>
                <span>{inCart.quantity}</span>
                <button
                  onClick={() => increaseQty(product.id)}
                  className="border border-gray-400 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
              <Link
                href="/cart"
                className="block mt-2 text-sm text-center border border-blue-600 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 transition max-w-[80%] mx-auto"
              >
                View Cart
              </Link>
            </>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="border border-green-600 text-green-600 px-3 py-1 rounded-full mt-2 text-sm hover:bg-green-50 transition max-w-[80%] mx-auto block"
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
      <Head>
  <title>Herbo life | Herbal Health & Wellness Store</title>
  <meta name="description" content="Shop authentic ayurvedic health and wellness products at best prices. High quality, original, and effective herbal solutions - Herbo life." />
  <meta name="keywords" content="Herbo life, ayurvedic, herbal, wellness, organic, health, supplements, immunity, natural,sexual wellness,Power Plus, Weight loss, Female health , men's health" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://store.herbolife.in/" />
  
  <meta property="og:title" content="Herbo life | Herbal Health & Wellness Store" />
  <meta property="og:description" content="Original and effective ayurvedic products delivered fast. 100% genuine, high-quality wellness essentials from Herbo life." />
  <meta property="og:image" content="https://store.herbolife.in/images/banner1.jpg" />
  <meta property="og:url" content="https://store.herbolife.in/" />
  <meta property="og:type" content="website" />
  
  <meta name="twitter:card" content="summary_large_image" />
</Head>


      {/* Banner Section */}
      <div className="px-4 md:px-8 my-12 relative w-full h-56 md:h-72 rounded-lg overflow-hidden">
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

      {/* Features Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-y-6 px-4 md:px-16 text-center py-6 border-b bg-white my-12">
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

      {/* Shop by Category */}
      <section className="px-4 md:px-8 mb-6">
        <h2 className="text-2xl font-bold mb-4">
          SHOP BY <span className="text-green-600">CATEGORY</span>
        </h2>
        <div className="flex overflow-x-auto flex-nowrap gap-4 hide-scrollbar px-1">
          {randomCategoryProducts.map(({ category, product }) => (
            <div
              key={category}
              className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.5rem)] md:w-[calc(20%-0.5rem)] bg-white rounded-2xl shadow p-4 flex-shrink-0 hover:shadow-xl transition duration-300"
            >
              <Link href={`/category/${category}`}>
                <div className="overflow-hidden rounded-lg mb-2 transition-transform duration-300 hover:scale-105">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-sm text-center">{category}</h3>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Products */}
      <section className="bg-gray-50 px-4 md:px-8 py-6 mt-0">
        <h2 className="text-2xl font-bold mb-6">
          LATEST <span className="text-green-600">PRODUCTS</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map(renderProductCard)}
        </div>
      </section>
    </>
  );
}