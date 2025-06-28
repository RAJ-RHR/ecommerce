'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Total amount
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.offer_price) * Number(item.quantity),
    0
  );

  // Total savings
  const totalSavings = cartItems.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) - Number(item.offer_price)) * Number(item.quantity),
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">
          Your cart is empty.{' '}
          <Link href="/shop" className="text-green-600 underline">
            Go shopping
          </Link>
        </p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-center border-b pb-4"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="object-contain rounded bg-white"
                />

                <div className="flex-1 ml-4 w-full">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <p className="text-sm">
                    Price: <span className="line-through">₹{item.price}</span>{' '}
                    <span className="text-green-600 font-bold">
                      ₹{item.offer_price}
                    </span>
                  </p>

                  {/* Quantity Control */}
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Number(item.quantity) - 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Number(item.quantity) + 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="mt-1 text-sm text-gray-700 font-medium">
                    Total: ₹
                    {Number(item.offer_price) * Number(item.quantity)}
                  </p>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-8 border-t pt-4 text-right space-y-2">
            <p className="text-lg">
              <span className="font-medium">Total:</span>{' '}
              <span className="font-bold text-green-600 text-xl">
                ₹{total.toFixed(2)}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              You saved ₹{totalSavings.toFixed(2)} on this order 🎉
            </p>

            <Link
              href="/checkout"
              className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
