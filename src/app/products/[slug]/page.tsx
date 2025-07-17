'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Head from 'next/head';
import Script from 'next/script';
import type { Product } from '@/context/CartContext';

type ProductWithSlug = Product & { slug: string };

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<ProductWithSlug | null>(null);
  const [related, setRelated] = useState<ProductWithSlug[]>([]);
  const [categoryShowcase, setCategoryShowcase] = useState<ProductWithSlug[]>([]);
  const [loading, setLoading] = useState(true); // 👈 Added loading state
  const { cartItems, addToCart, increaseQty, decreaseQty, removeFromCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // 👈 Start loading

      if (!slug || typeof slug !== 'string') {
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();

        const fetchedProduct: ProductWithSlug = {
          id: docSnap.id,
          name: data.name,
          image: data.image,
          category: data.category,
          label: data.label,
          description: data.description || 'Ayurvedic Product',
          price: Number(data.price),
          offer_price: Number(data.offer_price),
          slug: data.slug,
        };

        setProduct(fetchedProduct);
        fetchRelated(fetchedProduct.category, fetchedProduct.slug);
      }

      setLoading(false); // 👈 Stop loading
    };

    const fetchRelated = async (category: string, excludeSlug: string) => {
      const q = query(collection(db, 'products'), where('category', '==', category), limit(4));
      const snapshot = await getDocs(q);
      const relatedProducts: ProductWithSlug[] = snapshot.docs
        .filter((doc) => doc.data().slug !== excludeSlug)
        .map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.name,
            image: d.image,
            category: d.category,
            label: d.label,
            description: d.description || 'Ayurvedic Product',
            price: Number(d.price),
            offer_price: Number(d.offer_price),
            slug: d.slug,
          };
        });
      setRelated(relatedProducts);
    };

    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      const categoryMap = new Map<string, ProductWithSlug>();

      snapshot.docs.forEach((doc) => {
        const d = doc.data();
        const cat = d.category;
        if (!categoryMap.has(cat)) {
          categoryMap.set(cat, {
            id: doc.id,
            name: d.name,
            image: d.image,
            category: d.category,
            label: d.label,
            description: d.description || 'Ayurvedic Product',
            price: Number(d.price),
            offer_price: Number(d.offer_price),
            slug: d.slug,
          });
        }
      });

      setCategoryShowcase(Array.from(categoryMap.values()));
    };

    fetchProduct();
    fetchCategories();
  }, [slug]);

  // ✅ Handle loading and not found state separately
  if (loading) {
    return <div className="mt-24 text-center text-gray-500">Loading product...</div>;
  }

  if (!product) {
    return <div className="mt-24 text-center text-red-500">Product not found.</div>;
  }

  if (!product) return <div className="mt-24 text-center text-gray-600">Product not found</div>;

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

  const canonicalUrl = `https://store.herbolife.in/products/${product.slug}`;
  const title = `${product.name} | Herbolife`;
  const description = product.description;

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const today = new Date();
  const deliveryStart = new Date(today);
  const deliveryEnd = new Date(today);
  deliveryStart.setDate(today.getDate() + 6);
  deliveryEnd.setDate(today.getDate() + 8);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="keywords" content={`${product.name}, Herbolife, herbal, wellness`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <Script type="application/ld+json" id="product-schema" strategy="afterInteractive">
  {JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description: description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Herbolife"
    },
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: "4",
        bestRating: "5"
      },
      author: {
        "@type": "Person",
        name: "Verified Buyer"
      }
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      reviewCount: "23"
    },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "INR",
      price: product.offer_price,
      priceValidUntil: "2025-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock"
    }
  })}
</Script>


      <div className="mt-20 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="relative bg-white p-4 shadow rounded-xl">
            {product.label && (
              <span className={`absolute top-2 left-2 text-xs text-white px-2 py-1 rounded ${getLabelColor(product.label)}`}>
                {product.label}
              </span>
            )}
            <img src={product.image} alt={product.name} className="w-full h-96 object-contain" />
          </div>

          <div className="flex flex-col justify-start">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-2">Category: {product.category}</p>

            <div className="flex items-center gap-3 mb-4">
              <p className="text-xl line-through text-gray-500">₹{product.price.toFixed(2)}</p>
              <p className="text-2xl font-bold text-green-600">₹{product.offer_price.toFixed(2)}</p>
            </div>

            {inCart ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <button onClick={handleDecrease} className="px-3 py-1 border rounded-full">−</button>
                  <span>{inCart.quantity}</span>
                  <button onClick={() => increaseQty(product.id)} className="px-3 py-1 border rounded-full">+</button>
                </div>
                <Link href="/cart"   className="w-full max-w-xs py-2 text-sm border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition text-center block mt-2">
                  Go to Cart
                </Link>
              </>
            ) : (
              <button onClick={() => addToCart(product)} className="w-full max-w-xs py-2 text-sm border border-green-600 text-green-600 rounded-full hover:bg-green-50 transition">
                Add to Cart
              </button>
            )}

            <div className="mt-4 text-sm text-gray-500">
              🚚 Estimated delivery: {formatDate(deliveryStart)} – {formatDate(deliveryEnd)}
            </div>
          </div>

          <div className="md:col-span-2 mt-6 text-gray-700 text-sm whitespace-pre-line leading-relaxed">
            {product.description}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="px-4 md:px-8 my-12">
          <h2 className="text-xl font-bold mb-4">Related Products</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((item) => {
              const itemInCart = cartItems.find((i) => i.id === item.id);
              return (
                <div key={item.id} className="border rounded-xl p-4 shadow hover:shadow-lg transition text-center relative">
                  {item.label && (
                    <span className={`absolute top-2 left-2 text-xs text-white px-2 py-1 rounded ${getLabelColor(item.label)}`}>
                      {item.label}
                    </span>
                  )}
                  <Link href={`/products/${item.slug}`}>
                    <img src={item.image} alt={item.name} className="h-40 w-full object-contain mb-2" />
                    <h3 className="font-semibold text-base mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-1">Category: {item.category}</p>
                    <div className="flex justify-center items-center gap-2 mb-2">
                      <p className="text-sm line-through text-gray-400">₹{item.price.toFixed(2)}</p>
                      <p className="text-green-600 font-bold text-lg">₹{item.offer_price.toFixed(2)}</p>
                    </div>
                  </Link>

                  {itemInCart ? (
                    <>
                      <div className="flex justify-center items-center gap-2 mb-1">
                        <button onClick={() => decreaseQty(item.id)} className="border px-3 py-1 rounded-full">−</button>
                        <span>{itemInCart.quantity}</span>
                        <button onClick={() => increaseQty(item.id)} className="border px-3 py-1 rounded-full">+</button>
                      </div>
                      <Link href="/cart" className="text-sm border border-blue-600 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50">
                        Go to Cart
                      </Link>
                    </>
                  ) : (
                    <button onClick={() => addToCart(item)} className="text-sm border border-green-600 text-green-600 px-3 py-1 rounded-full hover:bg-green-50">
                      Add to Cart
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Shop by Category */}
      {categoryShowcase.length > 0 && (
        <section className="w-full mt-12 mb-8 px-4 md:px-8">
          <h2 className="text-2xl font-bold mb-4 text-center">
            SHOP BY <span className="text-green-600">CATEGORY</span>
          </h2>
          <div className="flex overflow-x-auto flex-nowrap gap-4 hide-scrollbar">
            {categoryShowcase.map((prod) => (
              <div
                key={prod.category}
                className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.5rem)] md:w-[calc(20%-0.5rem)] bg-white rounded-2xl shadow p-4 flex-shrink-0 hover:shadow-xl transition duration-300"
              >
                <Link href={`/category/${prod.category}`}>
                  <div className="overflow-hidden rounded-lg mb-2 transition-transform duration-300 hover:scale-105">
                    <img src={prod.image} alt={prod.name} className="w-full h-32 object-contain" />
                  </div>
                  <h3 className="font-semibold text-sm text-center">{prod.category}</h3>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
