'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminHomePage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const [pendingReviews, setPendingReviews] = useState(0);
  const [pendingContacts, setPendingContacts] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    const adminFlag = localStorage.getItem('admin');
    if (adminFlag === 'true') {
      setIsAdmin(true);
    } else {
      router.push('/admin/login');
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchCounts = async () => {
      const reviewSnap = await getDocs(
        query(collection(db, 'reviews'), where('status', '==', 'pending'))
      );
      setPendingReviews(reviewSnap.size);

      const contactSnap = await getDocs(
        query(collection(db, 'contacts'), where('read', '==', false))
      );
      setPendingContacts(contactSnap.size);

      const orderSnap = await getDocs(
        query(collection(db, 'orders'), where('status', '==', 'Pending'))
      );
      setPendingOrders(orderSnap.size);
    };

    fetchCounts();
  }, [isAdmin]);

  if (checking) return null;

  return (
    <div className="mt-24 max-w-4xl mx-auto px-6 text-center">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders */}
        <Link
          href="/admin/orders"
          className="relative bg-green-600 text-white p-6 rounded-xl shadow hover:shadow-lg hover:bg-green-700 transition duration-300 text-lg font-medium flex justify-between items-center"
        >
          Manage Orders <span className="text-xl">→</span>
          {pendingOrders > 0 && (
            <span className="absolute top-2 right-2 bg-white text-green-700 font-bold text-xs px-2 py-0.5 rounded-full">
              {pendingOrders}
            </span>
          )}
        </Link>

        {/* Contacts */}
        <Link
          href="/admin/contacts"
          className="relative bg-blue-600 text-white p-6 rounded-xl shadow hover:shadow-lg hover:bg-blue-700 transition duration-300 text-lg font-medium flex justify-between items-center"
        >
          View Contacts <span className="text-xl">→</span>
          {pendingContacts > 0 && (
            <span className="absolute top-2 right-2 bg-white text-blue-700 font-bold text-xs px-2 py-0.5 rounded-full">
              {pendingContacts}
            </span>
          )}
        </Link>

        {/* Products */}
        <Link
          href="/admin/product"
          className="bg-orange-600 text-white p-6 rounded-xl shadow hover:shadow-lg hover:bg-orange-700 transition duration-300 text-lg font-medium flex justify-between items-center"
        >
          Edit Products <span className="text-xl">→</span>
        </Link>

        {/* Reviews */}
        <Link
          href="/admin/review"
          className="relative bg-purple-600 text-white p-6 rounded-xl shadow hover:shadow-lg hover:bg-purple-700 transition duration-300 text-lg font-medium flex justify-between items-center"
        >
          Check Reviews <span className="text-xl">→</span>
          {pendingReviews > 0 && (
            <span className="absolute top-2 right-2 bg-white text-purple-700 font-bold text-xs px-2 py-0.5 rounded-full">
              {pendingReviews}
            </span>
          )}
        </Link>

        {/* Blogs */}
        <Link
          href="/admin/blog"
          className="bg-pink-600 text-white p-6 rounded-xl shadow hover:shadow-lg hover:bg-pink-700 transition duration-300 text-lg font-medium flex justify-between items-center"
        >
          Manage Blogs <span className="text-xl">→</span>
        </Link>

        {/* Report */}
        <Link
          href="/admin/report"
          className="bg-gray-700 text-white p-6 rounded-xl shadow hover:shadow-lg hover:bg-gray-800 transition duration-300 text-lg font-medium flex justify-between items-center"
        >
          Dashboard Report <span className="text-xl">→</span>
        </Link>
      </div>

      <button
        onClick={() => {
          localStorage.removeItem('admin');
          router.push('/admin/login');
        }}
        className="mt-10 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
