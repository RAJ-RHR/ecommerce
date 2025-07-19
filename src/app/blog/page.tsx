import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health & Wellness Blogs | Herbolife Store',
  description: 'Discover expert health tips, wellness advice, and product insights in the Herbolife blog. Stay updated and inspired!',
  alternates: {
    canonical: 'https://store.herbolife.in/blog',
  },
};

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  image?: string;
  category?: string;
}

export default async function BlogPage() {
  const blogs: Blog[] = [];

  const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data?.slug && data?.title && data?.content) {
      blogs.push({
        id: doc.id,
        title: data.title,
        slug: data.slug,
        content: data.content,
        image: data.image,
        category: data.category,
      });
    }
  });

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Our Blogs</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="group bg-white rounded-xl border p-4 hover:shadow-xl transition"
          >
            {blog.image && (
              <Image
                src={blog.image}
                alt={blog.title}
                width={600}
                height={300}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-2xl font-semibold group-hover:text-green-600 transition">
              {blog.title}
            </h2>
            {blog.category && (
              <p className="text-sm text-orange-600 font-medium mt-1">
                {blog.category}
              </p>
            )}
            <p className="text-gray-600 mt-2 line-clamp-3">{blog.content}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
