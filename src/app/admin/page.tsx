'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminHomePage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    if (isAdmin === 'true') {
      setIsAuthorized(true);

      // Auto logout after 5 minutes of inactivity
      let timeout: NodeJS.Timeout;
      const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          localStorage.removeItem('admin');
          alert('Session expired due to inactivity.');
          router.push('/admin/login');
        }, 5 * 60 * 1000);
      };

      const events = ['mousemove', 'keydown', 'click', 'scroll'];
      events.forEach((event) => document.addEventListener(event, resetTimer));
      resetTimer();

      return () => {
        clearTimeout(timeout);
        events.forEach((event) =>
          document.removeEventListener(event, resetTimer)
        );
      };
    } else {
      router.push('/admin/login');
    }
  }, []);

  if (!isAuthorized) return null;

  return (
    <div className="mt-24 max-w-3xl mx-auto px-6 text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/orders"
          className="bg-green-600 text-white p-6 rounded-lg shadow hover:bg-green-700 transition text-lg font-medium"
        >
          Manage Orders
        </Link>
        <Link
          href="/admin/contacts"
          className="bg-blue-600 text-white p-6 rounded-lg shadow hover:bg-blue-700 transition text-lg font-medium"
        >
          View Contacts
        </Link>
        <Link
          href="/admin/product"
          className="bg-orange-600 text-white p-6 rounded-lg shadow hover:bg-orange-700 transition text-lg font-medium"
        >
          Edit Products
        </Link>
      </div>
    </div>
  );
}
