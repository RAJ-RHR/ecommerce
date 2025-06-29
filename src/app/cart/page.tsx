'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import Footer from '@/components/Footer';

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  offer_price: number;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const updateCart = (items: CartItem[]) => {
    setCart(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const increaseQty = (id: string) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(updated);
  };

  const decreaseQty = (id: string) => {
    const updated = cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    updateCart(updated);
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(item => item.id !== id);
    updateCart(updated);
  };
const clearCart = () => {
  localStorage.removeItem('cart'); // ❗ Clear from localStorage
  setCart([]); // ❗ Also clear from state
};

  

  const total = cart.reduce((acc, item) => acc + item.offer_price * item.quantity, 0);

  return (
    <>
      

      {cart.length === 0 ? (
        <div className="p-8 text-center text-lg font-semibold">
          🛒 Your cart is empty.
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">🛍️ Your Cart</h2>

          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-4 mb-4 border-b pb-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm line-through">₹{item.price}</p>
                <p className="text-green-600 font-bold">₹{item.offer_price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:underline"
              >
                ❌ Remove
              </button>
            </div>
          ))}

          <div className="mt-6 text-right text-xl font-semibold">
            Total: ₹{total.toFixed(2)}
          </div>

          <div className="text-right mt-4 flex justify-end gap-4">
            <button
              onClick={clearCart}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Clear Cart
            </button>
           
<Link href="/checkout">
  <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
    Proceed to Checkout
  </button>
</Link>
          </div>
        </div>
      )}

  
    </>
  );
}
