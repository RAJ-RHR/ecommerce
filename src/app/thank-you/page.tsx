'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import Image from 'next/image';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const oid = searchParams.get('oid'); // numeric order ID from ?oid=xxxx
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!oid) return;

      const q = query(collection(db, 'orders'), where('numericOrderId', '==', Number(oid)));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setOrder({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      }

      setLoading(false);
    };

    fetchOrder();
  }, [oid]);

  if (loading) {
    return <p className="text-center mt-20 text-lg">Loading your order details...</p>;
  }

  if (!order) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold mb-2 text-red-600">❌ Order Not Found</h2>
        <Link href="/shop" className="text-blue-600 underline text-sm">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-green-700">✅ Order Placed Successfully!</h2>
        <p className="mt-2 text-gray-600">
          Thank you <strong>{order.name}</strong>, your order is confirmed.
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>Order ID:</strong> #{order.numericOrderId}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          </div>
          <div>
            <p><strong>Shipping To:</strong></p>
            <p>{order.name}</p>
            <p>{order.address}</p>
            <p>{order.phone}</p>
            <p>{order.email}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-lg mb-2">🛒 Items Ordered</h3>
          <ul className="space-y-4 text-sm">
            {order.cartItems?.map((item: any, idx: number) => (
              <li key={idx} className="flex gap-4 items-center border-b pb-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain bg-white border rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  <p className="text-green-700 font-semibold text-sm">
                    ₹{item.offer_price} × {item.quantity} = ₹{item.offer_price * item.quantity}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t pt-4 text-right">
          <p className="text-lg font-bold">Total: ₹{order.total}</p>
          {order.totalSavings > 0 && (
            <p className="text-green-600 text-sm">You saved ₹{order.totalSavings.toFixed(2)} 🎉</p>
          )}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          href="/shop"
          className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          🛍️ Continue Shopping
        </Link>
      </div>
    </div>
  );
}
