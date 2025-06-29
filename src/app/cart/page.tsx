'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    totalAmount,
  } = useCart();

  return (
    <>
      <div className="mt-20"></div>

      {cartItems.length === 0 ? (
        <div className="p-8 text-center text-lg font-semibold">
          🛒 Your cart is empty.
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">🛍️ Your Cart</h2>

          {cartItems.map((item) => (
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
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:underline"
              >
                ❌ Remove
              </button>
            </div>
          ))}

          <div className="mt-6 text-right text-xl font-semibold">
            Total: ₹{totalAmount.toFixed(2)}
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
