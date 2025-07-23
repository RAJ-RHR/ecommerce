'use client';


import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/context/CartContext';
import Script from 'next/script';
import Head from 'next/head';
import Link from 'next/link';


type ProductWithSlug = Product & {
  slug: string;
  meta_description?: string;
  meta_keywords?: string;
};

type Review = {
  id?: string;
  name: string;
  message: string;
  rating: number;
  productId?: string;
  productName?: string;
  productCategory?: string;
  created_at?: any;
dateOfSubmit?: { seconds: number } | Date | null;

  status?: string;
};


export default function ProductPage() {
  const [showAllReviews, setShowAllReviews] = useState(false);

  const { slug } = useParams();
  const [product, setProduct] = useState<ProductWithSlug | null>(null);
  const [related, setRelated] = useState<ProductWithSlug[]>([]);
  const [categoryShowcase, setCategoryShowcase] = useState<ProductWithSlug[]>([]);
  const [availability, setAvailability] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewForm, setReviewForm] = useState({ name: '', message: '', rating: 5 });

  const {
    addToCart,
    increaseQty,
    decreaseQty,
    cartItems,
  } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);

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
  meta_description: data.meta_description || '',  // ✅
  meta_keywords: data.meta_keywords || '',        // ✅
};


        setProduct(fetchedProduct);
        setAvailability(data.availability || '');
        fetchRelated(fetchedProduct.category, fetchedProduct.slug);
        fetchReviews(docSnap.id);
      }

      setLoading(false);
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

   const fetchReviews = async (productId: string) => {
  const q = query(
    collection(db, 'reviews'),
    where('productId', '==', productId),
    where('status', '==', 'approved')
  );
  const snapshot = await getDocs(q);
  const fetchedReviews = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      message: data.message,
      rating: data.rating,
      productId: data.productId,
      productName: data.productName,
      productCategory: data.productCategory,
      status: data.status,
      created_at: data.created_at,
     dateOfSubmit:
  data.dateOfSubmit && 'seconds' in data.dateOfSubmit
    ? new Date(data.dateOfSubmit.seconds * 1000)
    : data.dateOfSubmit instanceof Date
    ? data.dateOfSubmit
    : null,

    };
  }) as Review[];

  setReviews(fetchedReviews);
};

// inside useEffect
fetchProduct();
fetchCategories();

  }, [slug]);

  const handleReviewSubmit = async () => {
    if (!product) return;
    const reviewData = {
  ...reviewForm,
  created_at: serverTimestamp(),
  productId: product.id,
  productName: product.name, // ✅ Add this line
   productCategory: product.category, // ✅ Add category here
     dateOfSubmit: new Date(), // Add this line
  status: 'pending',
};
    

    await addDoc(collection(db, 'reviews'), reviewData);
    alert('Review submitted and pending approval.');
    setReviewForm({ name: '', message: '', rating: 5 });
  };

  const renderAvailability = () => {
    const statusColor =
      availability === 'In Stock'
        ? 'text-green-600'
        : availability === 'Limited Stock'
        ? 'text-orange-500'
        : 'text-red-600';
    return <p className={`text-sm font-medium ${statusColor}`}>Availability: {availability}</p>;
  };

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'Hot Deal':
        return 'bg-red-600';
      case 'Sale':
        return 'bg-green-600';
      case 'Limited Offer':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (!product) return null;

  const inCart = cartItems.find((item) => item.id === product.id);
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
     
   {reviews.length > 0 && averageRating >= 1 && averageRating <= 5 && (
  <Script type="application/ld+json" id="product-schema" strategy="lazyOnload">
    {JSON.stringify({
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.name,
      image: [product.image],
      description: description,
      sku: product.id,
      brand: {
        '@type': 'Brand',
        name: 'Herbolife',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: reviews.length,
      },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'INR',
        price: product.offer_price,
        priceValidUntil: '2025-12-31',
        itemCondition: 'https://schema.org/NewCondition',
        availability: 'https://schema.org/InStock',
      },
    })}
  </Script>
)}

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

           <div className="bg-gray-50 border rounded-lg p-4 mb-4">
  <div className="flex items-center justify-between">
    <div className="text-green-600 font-bold text-xl">
      Special price: ₹{product.offer_price.toFixed(2)}
    </div>
    <div className="line-through text-gray-500 text-sm">
      Old price: ₹{product.price.toFixed(2)}
    </div>
    <div className="text-red-500 font-semibold text-sm">
      You save: ₹{(product.price - product.offer_price).toFixed(2)}
    </div>
  </div>
</div>

 <div className="mb-4">{renderAvailability()}</div> {/* Gap added here */}

            {inCart ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <button onClick={() => decreaseQty(product.id)} className="px-3 py-1 border rounded-full">−</button>
                  <span>{inCart.quantity}</span>
                  <button onClick={() => increaseQty(product.id)} className="px-3 py-1 border rounded-full">+</button>
                </div>
                <Link href="/cart" className="w-full max-w-xs py-2 text-sm border border-blue-600 text-blue-600 rounded-full hover:bg-blue-50 transition text-center block mt-2">
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

      
    {/* ⭐ REVIEWS SECTION */}
    <section className="mt-10 border-t border-gray-300 pt-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Customer Reviews</h3>

      {/* Skeleton Placeholder while loading */}
      {loadingReviews && reviews.length === 0 && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 animate-pulse rounded-lg border border-gray-200"
            ></div>
          ))}
        </div>
      )}

      {!loadingReviews && reviews.length > 0 ? (
        <>
          <div className="grid gap-4">
            {(showAllReviews ? reviews : reviews.slice(0, 3)).map((review) => {
              const date =
                review.dateOfSubmit instanceof Date
                  ? review.dateOfSubmit
                  : review.dateOfSubmit?.seconds
                  ? new Date(review.dateOfSubmit.seconds * 1000)
                  : null;

              const formattedDate = date
                ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}/${date.getFullYear()}`
                : 'N/A';

              return (
                <div
                  key={review.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800">
                      {review.name}{' '}
                      <span className="text-sm text-gray-500 font-normal">{formattedDate}</span>
                    </p>
                    <div className="text-yellow-500 text-sm">
                      <span>
                        {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.message}</p>
                </div>
              );
            })}
          </div>

          {reviews.length > 3 && (
            <button
              onClick={() => setShowAllReviews(!showAllReviews)}
              className="mt-4 text-blue-600 hover:underline text-sm"
            >
              {showAllReviews ? 'See Less Reviews' : 'See More Reviews'}
            </button>
          )}
        </>
      ) : (
        !loadingReviews && <p className="text-sm text-gray-500">No reviews yet.</p>
      )}
    </section>

    {/* ✅ Product Schema for SEO */}
    {reviews.length > 0 && averageRating >= 1 && averageRating <= 5 && (
      <Script
        type="application/ld+json"
        id="product-schema"
        strategy="lazyOnload"
      >
        {JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          name: product.name,
          image: product.image,
          description: product.description,
          brand: {
            "@type": "Brand",
            name: "Herbolife Store",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            reviewCount: reviews.length,
          },
        })}
      </Script>

          {/* ⭐ REVIEW FORM */}
          <div className="mt-10">
            <h4 className="font-semibold mb-2">Write a Review</h4>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border px-2 py-1 rounded mb-2"
              value={reviewForm.name}
              onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
            />
            <textarea
              placeholder="Your Review"
              className="w-full border px-2 py-1 rounded mb-2"
              value={reviewForm.message}
              onChange={(e) => setReviewForm({ ...reviewForm, message: e.target.value })}
            />
           <div className="flex gap-1 mb-2 cursor-pointer">
  {Array.from({ length: 5 }).map((_, index) => (
    <span
      key={index}
      className={`text-2xl ${
        index < reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'
      }`}
      onClick={() => setReviewForm({ ...reviewForm, rating: index + 1 })}
    >
      ★
    </span>
  ))}
</div>

            <button
              onClick={handleReviewSubmit}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              Submit Review
            </button>
          </div>
        </section>
      </div>
{/* Related Products */}
{related.length > 0 && (
  <section className="px-4 md:px-8 my-12" id="related-products">
    <h2 className="text-xl font-bold mb-4">Related Products</h2>
    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
      {related.map((item) => {
        const itemInCart = cartItems.find((i) => i.id === item.id);
        return (
          <div
            key={item.id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition text-center relative"
          >
            {item.label && (
              <span
                className={`absolute top-2 left-2 text-xs text-white px-2 py-1 rounded ${getLabelColor(
                  item.label
                )}`}
              >
                {item.label}
              </span>
            )}

            <Link href={`/products/${item.slug}`} className="block">
              <div>
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  className="h-40 w-full object-contain mb-2"
                />
                <h3 className="font-semibold text-base mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  Category: {item.category}
                </p>
                <div className="flex justify-center items-center gap-2 mb-2">
                  <p className="text-sm line-through text-gray-400">
                    ₹{item.price.toFixed(2)}
                  </p>
                  <p className="text-green-600 font-bold text-lg">
                    ₹{item.offer_price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>

            {itemInCart ? (
              <>
                <div className="flex justify-center items-center gap-2 mb-1">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="border px-3 py-1 rounded-full"
                  >
                    −
                  </button>
                  <span>{itemInCart.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="border px-3 py-1 rounded-full"
                  >
                    +
                  </button>
                </div>
                <Link
                  href="/cart"
                  className="text-sm border border-blue-600 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-50 inline-block"
                >
                  Go to Cart
                </Link>
              </>
            ) : (
              <button
                onClick={() => addToCart(item)}
                className="text-sm border border-green-600 text-green-600 px-3 py-1 rounded-full hover:bg-green-50"
              >
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
    <div className="flex overflow-x-auto flex-nowrap gap-4 hide-scrollbar pb-1">
      {categoryShowcase.map((prod) => (
        <div
          key={prod.category}
          className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.5rem)] md:w-[calc(20%-0.5rem)] bg-white rounded-2xl shadow p-4 flex-shrink-0 hover:shadow-xl transition duration-300"
        >
          <Link href={`/category/${prod.category}`} className="block">
            <div className="overflow-hidden rounded-lg mb-2 transition-transform duration-300 hover:scale-105">
              <img
                src={prod.image}
                alt={prod.name}
                loading="lazy"
                className="w-full h-32 object-contain"
              />
            </div>
            <h3 className="font-semibold text-sm text-center">
              {prod.category}
            </h3>
          </Link>
        </div>
      ))}
    </div>
  </section>
)}

     
    </>
  );
}