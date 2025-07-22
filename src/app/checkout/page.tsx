'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'Cash On Delivery',
  });
  const router = useRouter();

  const total = cartItems.reduce((sum, item) => sum + item.offer_price * item.quantity, 0);
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.price - item.offer_price) * item.quantity,
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(form.phone)) {
      alert('Please enter a valid 10-digit phone number starting with 6-9.');
      return;
    }

    try {
      const createdAt = Timestamp.now();
      const numericOrderId = 5505 + Math.floor(Date.now() / 1000) % 100000;

      await addDoc(collection(db, 'orders'), {
        ...form,
        cartItems,
        total,
        totalSavings,
        createdAt,
        status: 'Pending',
        numericOrderId,
      });

      clearCart();
      router.push('/thank-you?oid=' + numericOrderId);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error placing order. Please try again.');
    }
  };
  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const today = new Date();
  const deliveryStart = new Date(today);
  const deliveryEnd = new Date(today);
  deliveryStart.setDate(today.getDate() + 6);
  deliveryEnd.setDate(today.getDate() + 8);


  return (
    <div className="mt-7">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">🛒 Checkout</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-4">Your cart is empty.</h3>
            <Link href="/shop">
              <button className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition font-semibold">
                🛍️ Shop Now
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cart Summary */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-4 items-center border-b pb-4">
                    <Link href={`/products/${item.slug}`}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain bg-white border rounded hover:scale-105 transition"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/products/${item.slug}`}>
                        <p className="font-medium hover:text-green-700 cursor-pointer">{item.name}</p>
                      </Link>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">
                        <span className="line-through text-gray-400 mr-1">₹{item.price.toFixed(2)}</span>
                        <span className="text-green-700 font-semibold">₹{item.offer_price.toFixed(2)}</span>
                      </p>
                    </div>
                    <div className="text-right font-semibold text-green-700">
                      ₹{(item.offer_price * item.quantity).toFixed(2)}
                    </div>
                  </li>
                ))}
                <li className="flex justify-between pt-4 text-lg font-bold border-t">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </li>
                {totalSavings > 0 && (
                  <li className="flex justify-between text-sm text-green-600 font-medium">
                    <span>You saved ₹{totalSavings.toFixed(2)} on this order 🎉</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Delivery Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Delivery Information</h3>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full p-2 border rounded"
              />
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Shipping Address"
                required
                className="w-full p-2 border rounded"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                required
                className="w-full p-2 border rounded"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                type="email"
                required
                className="w-full p-2 border rounded"
              />

              <div>
                <h4 className="font-semibold mt-4 mb-2">Payment Method</h4>
                <div className="space-y-2">
                  {['Paytm', 'Pay Online', 'Cash On Delivery', 'Bank Transfer'].map((method) => (
                    <label
                      key={method}
                      className={`block p-2 border rounded transition ${
                        method !== 'Cash On Delivery'
                          ? 'opacity-50 cursor-not-allowed'
                          : 'border-green-600 text-green-700 font-semibold'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={form.paymentMethod === method}
                        onChange={handleChange}
                        disabled={method !== 'Cash On Delivery'}
                        className="mr-2"
                      />
                      {method}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full border border-red-600 text-red-600 py-2 rounded-full hover:bg-red-50 transition font-semibold"
              >
                Order
              </button>
            </form>
            <div className="mt-4 text-sm text-gray-500">
              🚚 Estimated delivery: {formatDate(deliveryStart)} – {formatDate(deliveryEnd)}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
