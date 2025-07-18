'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function ReviewModerationPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const router = useRouter();

  const CATEGORY_OPTIONS = [
    'Weight Management',
    'Enhancers',
    'Energy & Fitness',
    "Children's Health",
    "Women's Health",
    "Men's Health",
    'Bone & Joint Health',
    'Digestive Health',
    'Sports Nutritions',
    'Skin & Body Care',
    'Male Enhancement',
  ];

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    if (isAdmin === 'true') {
      setIsAuthorized(true);
      fetchReviews();
      fetchProducts();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchReviews = async () => {
    const snapshot = await getDocs(collection(db, 'reviews'));
    const reviewList = snapshot.docs.map(doc => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.created_at?.toDate?.() || null
  };
});

    setReviews(reviewList);
  };

  const fetchProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleApproveReview = async (id: string) => {
    await updateDoc(doc(db, 'reviews', id), { status: 'approved' });
    fetchReviews();
  };

  const handleDeleteReview = async (id: string) => {
    if (confirm('Delete this review?')) {
      await deleteDoc(doc(db, 'reviews', id));
      fetchReviews();
    }
  };

  const getProductName = (review: any) => {
    const product = products.find(p => p.id === review.productId);
    return product?.name || review.productName || 'Unknown Product';
  };

  const filteredReviews = selectedCategory
    ? reviews.filter((r) => {
        const product = products.find(p => p.id === r.productId);
        return product && product.category === selectedCategory;
      })
    : reviews;

  if (!isAuthorized) return null;

  return (
    <div className="mt-24 max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📝 Review Moderation</h2>

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 rounded mb-6"
      >
        <option value="">All Categories</option>
        {CATEGORY_OPTIONS.map((cat) => (
          <option key={cat}>{cat}</option>
        ))}
      </select>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews
          .sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0))
          .map((review) => (
            <div key={review.id} className="border rounded p-3 bg-white shadow">
              <p className="font-semibold">
                {review.name} ({review.rating}⭐)
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {review.createdAt ? review.createdAt.toLocaleString() : 'No Date'}
              </p>
              <p className="text-sm text-gray-600">
                Product: {getProductName(review)}
              </p>
              <p className="text-gray-700 mt-2">{review.message}</p>
              <div className="mt-3 flex gap-2">
                {review.status !== 'approved' && (
                  <button
                    onClick={() => handleApproveReview(review.id)}
                    className="text-sm px-2 py-1 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-sm px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
