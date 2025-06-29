'use client';

import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 mt-8">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 text-sm">
        {/* About */}
        <div className="text-center md:text-left">
          <h3 className="font-bold text-base mb-2">About Us</h3>
          <p>We provide top quality health and wellness products to transform your life.</p>
        </div>

        {/* Contact & Address */}
        <div className="text-center">
          <h3 className="font-bold text-base mb-2">Address</h3>
          <p>Gurgaon, Haryana, India</p>
          <p>Email: contact@herbolife.in</p>
        </div>

        {/* WhatsApp & Policy */}
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

          <div>
            <Link href="/privacy-policy" className="text-gray-300 hover:text-white underline">
              Privacy Policy
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

