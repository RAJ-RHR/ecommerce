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
import Image from 'next/image';

const REVIEWS_PER_PAGE = 40;

export default function ReviewModerationPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editModal, setEditModal] = useState<any | null>(null);

  const CATEGORY_OPTIONS = [
    'Weight Management', 'Enhancers', 'Energy & Fitness', "Children's Health",
    "Women's Health", "Men's Health", 'Bone & Joint Health', 'Digestive Health',
    'Sports Nutritions', 'Skin & Body Care', 'Male Enhancement'
  ];

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    if (isAdmin === 'true') {
      setIsAuthorized(true);
      fetchData();
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  const fetchData = async () => {
    const [reviewsSnap, productsSnap] = await Promise.all([
      getDocs(collection(db, 'reviews')),
      getDocs(collection(db, 'products'))
    ]);
    const productList = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const reviewList = reviewsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.created_at?.toDate?.() || null,
      };
    });
    setProducts(productList);
    setReviews(reviewList);
  };

  const getProduct = (review: any) =>
    products.find(p => p.id === review.productId) || {};

  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, 'reviews', id), { status: 'approved' });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this review?')) {
      await deleteDoc(doc(db, 'reviews', id));
      fetchData();
    }
  };

  const handleSaveEdit = async () => {
    if (!editModal) return;
    await updateDoc(doc(db, 'reviews', editModal.id), {
      name: editModal.name,
      message: editModal.message,
      rating: editModal.rating,
      status: editModal.status,
      dateOfSubmit: editModal.dateOfSubmit instanceof Date ? editModal.dateOfSubmit : new Date(editModal.dateOfSubmit),
    });
    setEditModal(null);
    fetchData();
  };

  const filtered = reviews
    .filter(r => r.status === filterStatus)
    .filter(r => {
      const prod = getProduct(r);
      return (
        (!selectedCategory || prod.category === selectedCategory) &&
        r.rating >= ratingRange[0] &&
        r.rating <= ratingRange[1] &&
        (r.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prod.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    })
    .sort((a, b) =>
      sortBy === 'date'
        ? (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
        : b.rating - a.rating
    );

  const paginated = filtered.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  if (!isAuthorized) return null;

  return (
    <div className="mt-20 max-w-6xl mx-auto p-4">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => router.push('/admin')}
          className="text-blue-600 text-sm"
        >
          ← Go to Home
        </button>
        <h2 className="text-2xl font-bold ml-2">📝 Review Moderation</h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border p-2 rounded">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="border p-2 rounded">
          <option value="">All Categories</option>
          {CATEGORY_OPTIONS.map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="🔎 Search name/product"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="border p-2 rounded">
          <option value="date">Sort by Date</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* Review Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginated.map((review) => {
          const product = getProduct(review);
          return (
            <div key={review.id} className="border rounded p-3 bg-white shadow relative">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="absolute top-2 right-2 rounded"
                  loading="lazy"
                />
              )}
              <p className="font-semibold">
                {review.name} (
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)})
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {review.createdAt?.toLocaleString() || 'No Date'}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Product: {product.name || 'Unknown'}
              </p>
              <p className="text-gray-700 text-sm">{review.message}</p>

              <div className="mt-3 flex gap-2">
                {review.status === 'pending' && (
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="text-sm px-2 py-1 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-sm px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
                <button
                  onClick={() => setEditModal(review)}
                  className="text-sm px-2 py-1 bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: Math.ceil(filtered.length / REVIEWS_PER_PAGE) }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-md w-full">
            <p className="text-sm text-gray-500 mb-1">
              Created At: {editModal.createdAt?.toLocaleString()}
            </p>

           {/* Editable Date of Submit */}
<label className="block text-sm font-medium text-gray-700 mb-1">
  Date of Submit:
</label>
<input
  type="date"
  className="border w-full p-2 mb-4"
  value={
    editModal.dateOfSubmit?.seconds
      ? new Date(editModal.dateOfSubmit.seconds * 1000).toISOString().slice(0, 10)
      : editModal.dateOfSubmit
      ? new Date(editModal.dateOfSubmit).toISOString().slice(0, 10)
      : ''
  }
  onChange={(e) => {
    const selectedDate = new Date(e.target.value);
    // Reset time to midnight
    selectedDate.setHours(0, 0, 0, 0);
    setEditModal({ ...editModal, dateOfSubmit: selectedDate });
  }}
/>


            <label className="block text-sm mb-1">Name</label>
            <input
              className="border p-2 w-full mb-3"
              value={editModal.name}
              onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
            />

            <label className="block text-sm mb-1">Message</label>
            <textarea
              className="border p-2 w-full mb-3"
              value={editModal.message}
              onChange={(e) => setEditModal({ ...editModal, message: e.target.value })}
            />

            <label className="block text-sm mb-1">Rating</label>
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setEditModal({ ...editModal, rating: i + 1 })}
                  className={`text-xl ${i < editModal.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>

            <label className="block text-sm mb-1">Status</label>
            <select
              value={editModal.status}
              onChange={(e) => setEditModal({ ...editModal, status: e.target.value })}
              className="border p-2 w-full mb-4"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditModal(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
