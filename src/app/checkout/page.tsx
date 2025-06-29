'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'Paytm',
  });
  const [submitted, setSubmitted] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.offer_price * item.quantity, 0);
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.price - item.offer_price) * item.quantity,
    0
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Save order to Firestore
      const docRef = await addDoc(collection(db, 'orders'), {
        ...form,
        cartItems,
        total,
        totalSavings,
        createdAt: Timestamp.now(),
      });

      console.log('Order ID:', docRef.id);
      setSubmitted(true);
      clearCart();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">✅ Order Placed Successfully!</h2>
        <p className="mb-6">Payment Method: <strong>{form.paymentMethod}</strong></p>
        <p>Thank you for your order, {form.name}.</p>
        <Link href="/" className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">🛒 Checkout</h2>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-4">Your cart is empty.</h3>
            <Link href="/shop" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              🛍️ Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Cart Details */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex gap-4 items-center border-b pb-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-contain bg-white border rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      <p className="text-sm text-gray-500">
                        Price: <span className="line-through text-gray-400 mr-1">₹{item.price}</span>
                        <span className="text-green-700 font-semibold">₹{item.offer_price}</span>
                      </p>
                    </div>
                    <div className="text-right font-semibold text-green-700">
                      ₹{item.offer_price * item.quantity}
                    </div>
                  </li>
                ))}
                <li className="flex justify-between pt-4 text-lg font-bold border-t">
                  <span>Total:</span>
                  <span>₹{total}</span>
                </li>
                {totalSavings > 0 && (
                  <li className="flex justify-between text-sm text-green-600 font-medium">
                    <span>You saved ₹{totalSavings.toFixed(2)} on this order 🎉</span>
                    <span>₹{totalSavings}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* User Form */}
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
                    <label className="block" key={method}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={form.paymentMethod === method}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      {method === 'Paytm'
                        ? 'Credit Card / Debit Card (Paytm PG)'
                        : method}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 mt-4"
              >
                Place Order
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
