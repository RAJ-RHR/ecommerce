'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [perPage, setPerPage] = useState(40);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin');
    if (isAdmin === 'true') {
      setIsAuthorized(true);
      fetchOrders();

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

  const fetchOrders = async () => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const ordersList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setOrders(ordersList);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this order?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  if (!isAuthorized) return null;

  const filteredOrders = orders.filter((order) =>
    [order.name, order.email, order.phone]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const startIndex = (currentPage - 1) * perPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + perPage);
  const totalPages = Math.ceil(filteredOrders.length / perPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📦 Admin Orders Panel</h1>
        <button
          onClick={() => {
            localStorage.removeItem('admin');
            router.push('/admin/login');
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🔓 Logout
        </button>
      </div>

      {/* 🔍 Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full md:w-1/2 border p-2 rounded"
        />

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Show:</label>
          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border p-1 rounded"
          >
            {[40, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n} orders
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 📦 Orders List */}
      {paginatedOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-6">
          {paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-lg">{order.name}</p>
                  <p className="text-sm text-gray-600">{order.email}</p>
                  <p className="text-sm text-gray-600">{order.phone}</p>
                  <p className="text-sm text-gray-600">
                    Payment: {order.paymentMethod}
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-green-600 font-bold text-lg">
                    ₹{order.total}
                  </p>
                  <p className="text-xs text-gray-500">
                    Saved ₹{order.totalSavings?.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {order.createdAt?.toDate().toLocaleString()}
                  </p>

                  <div className="mt-2">
                    <label className="block text-sm font-medium mb-1">
                      Status:
                    </label>
                    <select
                      value={order.status || 'Pending'}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="border rounded p-1 text-sm"
                    >
                      {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-2">
                📍 Address: {order.address}
              </p>

              <div className="border-t pt-2 mt-2">
                <h3 className="font-semibold mb-2">🛒 Products:</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {order.cartItems?.map((item: any, index: number) => (
    <li
      key={index}
      className="bg-gray-50 p-3 rounded border flex items-center gap-3"
    >
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded"
        />
      )}
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-gray-700">
          ₹{item.offer_price} × {item.quantity} = ₹
          {item.offer_price * item.quantity}
        </p>
      </div>
    </li>
  ))}
</ul>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* ⏪ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-4 items-center">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="font-medium text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      )}

      <Link
        href="/admin"
        className="mt-10 inline-block text-blue-600 hover:underline"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
