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
        <div className="p-8 text-center">
          <p className="text-lg font-semibold mb-4">🛒 Your cart is empty.</p>
          <Link href="/shop">
            <button className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition font-semibold">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-6">
          <h2 className="text-2xl font-bold mb-6">🛍️ Your Cart</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 mb-4 border-b pb-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
              <div className="flex-1">
                <h3 className="font-semibold text-base">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-1">Category: {item.category}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-400 line-through">₹{item.price.toFixed(2)}</p>
                  <p className="text-green-600 font-bold text-lg">₹{item.offer_price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-3 py-1 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-3 py-1 border border-gray-400 text-gray-700 rounded-full hover:bg-gray-100"
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
              className="border border-red-600 text-red-600 px-6 py-2 rounded-full hover:bg-red-50 transition"
            >
              Clear Cart
            </button>

            <Link href="/checkout">
              <button className="border border-green-600 text-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition font-semibold">
                Buy Now
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
