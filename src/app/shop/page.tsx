'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  offer_price: number;
  category: string;
  label?: string;
  quantity?: number;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [randomCategoryProducts, setRandomCategoryProducts] = useState<
    { category: string; product: Product }[]
  >([]);

  const itemsPerPage = 8;
  const { cartItems, addToCart, increaseQty, decreaseQty } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [sort]);

  const fetchProducts = async () => {
    const productsRef = collection(db, 'products');
    let q;

    if (sort === 'low') q = query(productsRef, orderBy('offer_price'));
    else if (sort === 'high') q = query(productsRef, orderBy('offer_price', 'desc'));
    else if (sort === 'latest') q = query(productsRef, orderBy('createdAt', 'desc'));
    else q = productsRef;

    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
    setProducts(data);
    setCurrentPage(1);
  };

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

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

  const filtered = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? product.category === category : true;
    return matchSearch && matchCategory;
  });

  const paginatedProducts = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const getLabelColor = (label: string | undefined) => {
    if (label === 'Hot Deal') return 'bg-red-600';
    if (label === 'Sale') return 'bg-green-600';
    if (label === 'Limited Offer') return 'bg-orange-500';
    return '';
  };

  return (
    <div className="mt-20 px-4 md:px-8">
      <Head>
        <title>Shop Herbal Products | Herbolife Store</title>
        <meta
          name="description"
          content="Browse and shop premium herbal supplements, health products, and natural wellness items from Herbolife."
        />
        <meta
          name="keywords"
          content="Herbolife, herbal products, supplements, health, ayurveda, wellness store, shop"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://store.herbolife.in/shop" />
        <meta property="og:title" content="Shop Herbal Products | Herbolife Store" />
        <meta
          property="og:description"
          content="Explore Herbolife's full range of wellness and herbal health products. 100% genuine, fast delivery, easy returns."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://store.herbolife.in/shop" />
        <meta property="og:image" content="https://store.herbolife.in/images/banner1.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Search and Sort */}
      <div className="flex flex-col items-center gap-4 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full md:w-1/3 p-2 border rounded text-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-2 border rounded text-sm"
        >
          <option value="">Default</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
          <option value="latest">Latest</option>
        </select>
      </div>

      {/* Category Filters */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 py-2">
        <button
          onClick={() => setCategory('')}
          className={`px-4 py-1 rounded-full border text-sm whitespace-nowrap ${
            category === '' ? 'bg-green-600 text-white' : 'border-gray-400 text-gray-700'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1 rounded-full border text-sm whitespace-nowrap ${
              category === cat ? 'bg-green-600 text-white' : 'border-gray-400 text-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {paginatedProducts.map((product) => {
          const inCart = cartItems?.find((item) => item.id === product.id);

          return (
            <div
              key={product.id}
              className="border rounded-2xl shadow p-4 text-center relative group hover:shadow-lg transition duration-300 w-full max-w-xs"
            >
              <div className="absolute top-2 left-2 z-20">
                {product.label && (
                  <span
                    className={`text-xs text-white px-2 py-1 rounded ${getLabelColor(product.label)}`}
                  >
                    {product.label}
                  </span>
                )}
              </div>
              <Link href={`/products/${product.id}`}>
                <div className="overflow-hidden rounded-lg mb-2 transition-transform duration-300 hover:scale-105">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-40 w-full object-contain bg-white p-2"
                  />
                </div>
                <h3 className="text-base font-semibold mb-1">{product.name}</h3>
                <div className="text-center flex justify-center items-center gap-2">
                  <p className="text-gray-500 line-through text-sm">₹{product.price}</p>
                  <p className="text-green-600 font-bold text-lg">₹{product.offer_price}</p>
                </div>
              </Link>

              {inCart ? (
                <>
                  <div className="mt-2 flex justify-center items-center gap-2">
                    <button
                      onClick={() => decreaseQty(product.id)}
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
                  onClick={() => addToCart({ ...product })}
                  className="border border-green-600 text-green-600 px-3 py-1 rounded-full hover:bg-green-50 mt-2"
                >
                  Add to Cart
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? 'bg-green-600 text-white' : ''
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Shop by Category Section */}
      <section className="w-full mt-12 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Shop by <span className="text-green-600">Category</span>
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
    </div>
  );
}
