import { Metadata } from 'next';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import BlogContent from './BlogContent';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const q = query(collection(db, 'blogs'), where('slug', '==', params.slug));
  const snapshot = await getDocs(q);
  const blog = snapshot.docs[0]?.data();

  return {
    title: blog?.title || 'Blog',
    description: blog?.metaDesc || '',
  };
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const q = query(collection(db, 'blogs'), where('slug', '==', params.slug));
  const snapshot = await getDocs(q);
  const blog = snapshot.docs[0]?.data();

  if (!blog) return <div>Not Found</div>;

  return <BlogContent blog={blog} />;
}
