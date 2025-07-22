'use client';

import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 mt-8">
      <div className="max-w-7xl mx-auto text-sm">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-6">
          {/* About */}
          <div className="text-center space-y-2">
            <h3 className="font-bold text-base">About Us</h3>
            <p>We provide top quality health and wellness products to transform your life. 100% Ayurvedic @Herbolife</p>
            <Link href="/blog" className="text-green-400 hover:underline text-sm font-medium block">→ Latest Blogs</Link>
          </div>

          {/* Address */}
          <div className="text-center space-y-1">
            <h3 className="font-bold text-base">Address</h3>
            <p>Gurgaon, Haryana, India</p>
            <p>Email: contact@herbolife.in</p>
          </div>

          {/* WhatsApp */}
          <div className="text-center">
            <a
              href="https://wa.me/918603241934"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm transition"
            >
              <FaWhatsapp className="mr-2" />
              WhatsApp
            </a>
          </div>

          {/* Policies Bottom Split */}
          <div className="flex justify-between text-green-400 font-medium">
            <div className="space-y-1 text-left">
              <Link href="/privacy-policy" className="block hover:underline">Privacy Policy</Link>
              <Link href="/Terms" className="block hover:underline">Terms & Conditions</Link>
            </div>
            <div className="space-y-1 text-right">
              <Link href="/return" className="block hover:underline">Return & Refund</Link>
              <Link href="/disclaimer" className="block hover:underline">Disclaimer</Link>
            </div>
          </div>
        </div>

        {/* Laptop Layout */}
        <div className="hidden lg:grid grid-cols-3 gap-6">
          {/* About */}
          <div className="space-y-2 text-left">
            <h3 className="font-bold text-base">About Us</h3>
            <p>We provide top quality health and wellness products to transform your life. 100% Ayurvedic @Herbolife</p>
            <Link href="/blog" className="text-green-400 hover:underline text-sm font-medium block">→ Latest Blogs</Link>
          </div>

          {/* Address */}
          <div className="text-left space-y-1">
            <h3 className="font-bold text-base">Address</h3>
            <p>Gurgaon, Haryana, India</p>
         <p className="text-sm">
  <span className="mr-1">📧</span>
  <a href="mailto:contact@herbolife.in" className="text-green-400  break-all">→
    contact@herbolife.in
  </a>
</p>

          </div>

          {/* WhatsApp + Policies stacked */}
          <div className="text-right space-y-3">
            <a
              href="https://wa.me/918603241934"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm transition"
            >
              <FaWhatsapp className="mr-2" />
              WhatsApp
            </a>

            {/* Policies stacked below WhatsApp */}
            <div className="space-y-1 text-green-400 font-medium pt-2">
              <Link href="/privacy-policy" className="block hover:underline">→Privacy Policy</Link>
              <Link href="/Terms" className="block hover:underline">→Terms & Conditions</Link>
              <Link href="/return" className="block hover:underline">→Return & Refund</Link>
              <Link href="/disclaimer" className="block hover:underline">→Disclaimer</Link>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-6">
        © {new Date().getFullYear()} Herbolife. All rights reserved.
      </p>
    </footer>
  );
}
