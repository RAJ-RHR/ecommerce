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
      description: 'This product does not exist on Herbolife Store.',
    };
  }

  const product = querySnapshot.docs[0].data();

  return {
    title: `${product.name} | Herbolife Store`,
    description: product.description?.slice(0, 160) || 'Explore premium health products on Herbolife Store.',
    keywords: product.keywords || [product.name, 'Herbolife', 'supplement', 'health', 'wellness'],
    alternates: {
      canonical: `https://herbolife.in/product/${params.slug}`,
    },
    openGraph: {
      title: `${product.name} | Herbolife Store`,
      description: product.description?.slice(0, 160),
      url: `https://herbolife.in/product/${params.slug}`,
      images: [
        {
          url: product.image || '/default-og.jpg',
          alt: product.name,
        },
      ],
    },
  };
}

type Props = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: Props) {
  const q = query(collection(db, 'products'), where('slug', '==', params.slug));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return <div className="text-center mt-20 text-red-600">Product not found</div>;
  }

  const product = querySnapshot.docs[0].data();

  return <ProductClientView product={product} />;
}