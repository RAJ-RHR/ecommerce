'use client';

import { FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 px-4 mt-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        {/* About Us */}
        <div className="mb-4 md:mb-0 text-center md:text-left">
          <h3 className="font-bold text-base mb-1">About Us</h3>
          <p>We provide top quality health and wellness products to transform your life.</p>
        </div>

        {/* Address and WhatsApp for mobile */}
        <div className="w-full md:w-auto flex justify-between items-center md:block">
          {/* Address */}
          <div className="text-left md:text-right">
            <h3 className="font-bold text-base mb-1">Address</h3>
            <p>Gurgaon, Haryana, India</p>
            <p>Email: contact@herbolife.in</p>
          </div>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/918603241934"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 md:ml-0 mt-2 md:mt-4 inline-flex items-center justify-center text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-md text-sm transition"
          >
            <FaWhatsapp className="mr-2" />
            WhatsApp
          </a>
        </div>
      </div>

      <p className="text-center text-gray-400 text-xs mt-4">
        © {new Date().getFullYear()} Herbolife. All rights reserved.
      </p>
    </footer>
  );
}
