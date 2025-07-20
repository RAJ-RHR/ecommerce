'use client';

import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 mt-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
     <div className="text-center md:text-left space-y-2">
  <div>
    <h3 className="font-bold text-base mb-1">About Us</h3>
    <p>We provide top quality health and wellness products to transform your life. 100% Ayurvedic @Herbolife</p>
  </div>
  <Link
    href="/blog"
    className="text-green-400 hover:underline inline-block text-sm font-medium"
  >
    → Latest Blogs
  </Link>
</div>

        {/* Contact & Address */}
        <div className="text-center">
          <h3 className="font-bold text-base mb-2">Address</h3>
          <p>Gurgaon, Haryana, India</p>
          <p>Email: contact@herbolife.in</p>
        </div>

        {/* WhatsApp & Policies */}
        <div className="text-center md:text-right space-y-3">
          <a
            href="https://wa.me/918603241934"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-sm transition"
          >
            <FaWhatsapp className="mr-2" />
            WhatsApp
          </a>

          <div className="space-y-1">
            <Link href="/privacy-policy" className="block text-gray-300 hover:text-white underline">
              Privacy Policy
            </Link>
            <Link href="/Terms" className="block text-gray-300 hover:text-white underline">
              Terms & Conditions
            </Link>
            <Link href="/return" className="block text-gray-300 hover:text-white underline">
              Return & Refund Policy
            </Link>
            <Link href="/disclaimer" className="block text-gray-300 hover:text-white underline">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-6">
        © {new Date().getFullYear()} Herbolife. All rights reserved.
      </p>
    </footer>
  );
}
