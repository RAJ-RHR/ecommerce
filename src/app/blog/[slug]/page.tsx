import { Metadata } from 'next';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const q = query(collection(db, 'blogs'), where('slug', '==', params.slug));
  const snapshot = await getDocs(q);
  const blog = snapshot.docs[0]?.data();

  const plainContent = blog?.content?.replace(/<[^>]*>/g, ''); // strip HTML tags
  const shortDesc = plainContent?.slice(0, 160); // limit to 160 chars

  return {
    title: blog?.title ? `${blog.title} - Blog` : 'Blog',
    description: shortDesc || '',
  };
}
import BlogContent from './BlogContent';

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const q = query(collection(db, 'blogs'), where('slug', '==', params.slug));
  const snapshot = await getDocs(q);
  const blog = snapshot.docs[0]?.data();

  if (!blog) return <div>Not Found</div>;

  return <BlogContent blog={blog} />;
}
