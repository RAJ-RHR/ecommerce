// Server Component
import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import CategoryPageClient from './CategoryPageClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  return {
    title: `${decodedSlug} | Herbolife Store`,
    description: `Explore top herbal products in ${decodedSlug} category. Boost your wellness with natural care from Herbolife.`,
  };
}

export default async function CategorySlugPage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);

  const productsSnapshot = await getDocs(
    query(collection(db, 'products'), where('category', '==', decodedSlug))
  );

  const products = productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return <CategoryPageClient/>;
}
