'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategorySidebar from '@/components/CategorySidebar';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  offer_price: number;
  category: string;
  quantity?: number; // ✅ Added this line to fix type error
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');

  const {
    cartItems,
    addToCart,
    increaseQty,
    decreaseQty,
  } = useCart();

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
  };

  const filtered = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? product.category === category : true;
    return matchSearch && matchCategory;
  });

  return (
    <>
      <div className="mt-18">
        <main className="flex flex-col md:flex-row">
          <div className="md:w-1/5 p-4 border-r">
            <CategorySidebar setCategory={setCategory} />
          </div>

          <div className="md:w-4/5 p-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {filtered.map((product) => {
                const inCart = cartItems?.find((item) => item.id === product.id);

                return (
                  <div
                    key={product.id}
                    className="border rounded-lg shadow-sm p-4 text-center relative group hover:shadow-md"
                  >
                    <Link href={`/products/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-40 w-full object-contain bg-white p-2 rounded mb-2"
                      />
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-green-600 font-bold text-lg">₹{product.offer_price}</p>
                      <p className="text-sm text-gray-500 line-through">₹{product.price}</p>
                    </Link>

                    {inCart ? (
                      <>
                        <div className="mt-2 flex justify-center items-center gap-2">
                          <button
                            onClick={() => decreaseQty(product.id)}
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
                        onClick={() => addToCart({ ...product })}
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
      </div>
      <Footer />
    </>
  );
}
