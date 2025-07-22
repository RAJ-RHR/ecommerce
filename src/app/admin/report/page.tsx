'use client';

import Link from 'next/link';

export default function ReportPage() {
  return (
    <div className="p-4 mt-14 space-y-6">
      {/* Top Navigation Buttons */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded">Home</button>
          </Link>
          <Link href="/admin/orders">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Orders</button>
          </Link>
          <Link href="/admin/blog">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded">Blog</button>
          </Link>
          <Link href="/admin/review">
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1 rounded">Review</button>
          </Link>
          <Link href="/admin/product">
            <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded">Product</button>
          </Link>
          <Link href="/logout">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">Logout</button>
          </Link>
        </div>
      </div>

      {/* Power BI Report Embed */}
      <div className="w-full overflow-hidden rounded shadow">
        <iframe
          title="Power BI Report"
          width="100%"
          height="700"
          src="https://app.powerbi.com/view?r=eyJrIjoiYTU4YzFiOTMtMjJmYy00NTU3LTllYWYtYWI0Y2Q4ODZiNjcyIiwidCI6ImMxZGNlOGYxLWU0ZTMtNDI1Mi1hZTM4LWQyOTU3YTFmYTMzMyJ9"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
