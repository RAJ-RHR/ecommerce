'use client';

import Image from 'next/image';

export default function ContactPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">
        <span className="text-gray-700">Home</span> / <span>Page</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* Image */}
        <div>
          <Image
            src="/images/banner1.jpg" // ✅ Public image path
            alt="Herbalife Products"
            className="w-full rounded-lg"
            width={600}
            height={600}
          />
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm w-full">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">CONTACT US</h2>
          <p className="text-sm text-gray-600 mb-6">
            If you have any questions or concerns, please do not hesitate to contact us
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name*"
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-green-600"
            />
            <input
              type="email"
              placeholder="Email*"
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-green-600"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-green-600"
            />
            <textarea
              rows={4}
              placeholder="Message*"
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-green-600"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md text-sm"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
