'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaCreditCard,
} from 'react-icons/fa';

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
      <ul className="flex justify-around items-center py-2">
        {navItems.map(({ href, label, icon }) => {
          const isActive = pathname === href;

          return (
            <li key={href}>
              <Link href={href}>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition
                    ${
                      isActive
                        ? 'bg-green-200 text-green-700'
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    } relative`}
                >
                  {label === 'Cart' && totalQuantity > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {totalQuantity}
                    </span>
                  )}
                  {icon}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
