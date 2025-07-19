import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { notFound } from 'next/navigation';

interface Blog {
  title: string;
  content: string;
  image?: string;
  category?: string;
  createdAt?: any;
}

export default async function BlogSlugPage({ params }: { params: { slug: string } }) {
  const q = query(collection(db, 'blogs'), where('slug', '==', params.slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return notFound();

  const blog = snapshot.docs[0].data() as Blog;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
      {blog.category && (
        <p className="text-sm text-gray-500 mb-2">Category: {blog.category}</p>
      )}
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}
      <div className="prose prose-lg max-w-none">{blog.content}</div>
    </div>
  );
}
