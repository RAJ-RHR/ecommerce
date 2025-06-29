'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { FaHome, FaShoppingBag, FaShoppingCart, FaCreditCard } from 'react-icons/fa';

const navItems = [
  { href: '/', label: 'Home', icon: <FaHome /> },
  { href: '/shop', label: 'Shop', icon: <FaShoppingBag /> },
  { href: '/cart', label: 'Cart', icon: <FaShoppingCart /> },
  { href: '/checkout', label: 'Checkout', icon: <FaCreditCard /> },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { totalQuantity } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t z-50 md:hidden">
      <ul className="flex justify-around items-center py-2 text-xs">
        {navItems.map(({ href, label, icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex flex-col items-center ${
                pathname === href ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              <span className="text-xl relative">
                {label === 'Cart' && totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
