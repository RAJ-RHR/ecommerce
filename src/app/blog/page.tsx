'use client';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const time = Math.ceil(words / wordsPerMinute);
  return `${time} min read`;
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const blogsPerPage = 6;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const blogData = querySnapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            slug: data.slug,
            title: data.title,
            content: data.content,
            image: data.coverImage || '',
            createdAt: data.createdAt?.toDate()?.toDateString() || 'No date',
            tags: data.tags || [],
            category: data.category || '',
          };
        })
        .filter((blog) => blog.slug && blog.title && blog.content);

      setBlogs(blogData);
      setLoading(false);
    };

    fetchBlogs();
  }, []);

  const categories = [...new Set(blogs.map((blog) => blog.category).filter(Boolean))];

  const filteredBlogs = selectedCategory
    ? blogs.filter((b) => b.category === selectedCategory)
    : blogs;

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 mt-4 text-center">Our Latest Blogs</h1>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex justify-center mb-6">
          <select
            className="px-4 py-2 border rounded bg-white"
            value={selectedCategory || ''}
            onChange={(e) => {
              setSelectedCategory(e.target.value || null);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Blog Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse p-4 bg-white rounded-xl shadow">
              <div className="h-52 bg-gray-200 rounded w-full mb-4" />
              <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full mb-1" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : paginatedBlogs.length === 0 ? (
        <p className="text-gray-500 text-center">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="block p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              {blog.image && (
                <div className="relative w-full h-52 rounded overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mt-4 line-clamp-2">{blog.title}</h2>
              <div className="text-sm text-gray-600 flex justify-between mt-1">
                <span>{blog.createdAt}</span>
                <span>{calculateReadingTime(blog.content)}</span>
              </div>
              <p className="mt-2 text-gray-700 line-clamp-3">{blog.content}</p>

              {/* Tags */}
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {blog.tags.map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
