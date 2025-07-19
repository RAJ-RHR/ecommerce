// app/products/[slug]/page.tsx

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ProductClientView from './ProductClientView';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const q = query(collection(db, 'products'), where('slug', '==', params.slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return {
      title: 'Product Not Found | Herbolife Store',
      description: 'This product does not exist.',
    };
  }

  const product = querySnapshot.docs[0].data();

  return {
    title: `${product.name} | Herbolife Store`,
    description: product.description || 'Explore premium health products on Herbolife.',
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

type Props = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: Props) {
  const slug = params.slug;

  try {
    const q = query(collection(db, 'products'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return <div className="text-center mt-20 text-red-600">Product not found</div>;
    }

    const product = querySnapshot.docs[0].data();

    return <ProductClientView />;
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return <div className="text-center mt-20 text-red-600">Error loading product</div>;
  }
}
