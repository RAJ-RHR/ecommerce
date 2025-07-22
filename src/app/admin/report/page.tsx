'use client';

import Link from 'next/link';

export default function ReportPage() {
  return (
    <div className="p-4 mt-14 space-y-6">
      {/* Responsive Navigation Bar */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-center md:text-left">Dashboard</h1>
        <div className="flex flex-wrap justify-center md:justify-end gap-2">
          <Link href="/admin">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm sm:text-base">Home</button>
          </Link>
          <Link href="/admin/orders">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm sm:text-base">Orders</button>
          </Link>
          <Link href="/admin/blog">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded text-sm sm:text-base">Blog</button>
          </Link>
          <Link href="/admin/review">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1 rounded text-sm sm:text-base">Review</button>
          </Link>
          <Link href="/admin/product">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded text-sm sm:text-base">Product</button>
          </Link>
          <Link href="/logout">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm sm:text-base">Logout</button>
          </Link>
        </div>
      </div>

      {/* Responsive Power BI Report Embed */}
      <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded shadow">
        <iframe
          title="Power BI Report"
          src="https://app.powerbi.com/view?r=eyJrIjoiYTU4YzFiOTMtMjJmYy00NTU3LTllYWYtYWI0Y2Q4ODZiNjcyIiwidCI6ImMxZGNlOGYxLWU0ZTMtNDI1Mi1hZTM4LWQyOTU3YTFmYTMzMyJ9"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
        ></iframe>
      </div>
    </div>
  );
}
