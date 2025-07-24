import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import ProductClientView from './ProductClientView';
import type { Metadata } from 'next';

type ProductWithSlug = {
  id: string;
  name: string;
  image: string;
  category: string;
  label: string;
  description: string;
  price: number;
  offer_price: number;
  slug: string;
  meta_description?: string;
  meta_keywords?: string;
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const q = query(collection(db, 'products'), where('slug', '==', params.slug), limit(1));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    return {
      title: 'Product Not Found | Herbolife Store',
      description: 'This product does not exist.',
    };
  }

  const product = querySnapshot.docs[0].data();

  return {
    title: `${product.name} | ${product.category} | Herbolife Store`,
    description: product.meta_description?.slice(0, 160) || 'Explore premium health products on Herbolife.',
    openGraph: {
      title: `${product.name} | Herbolife Store`,
      description: product.meta_description || 'Explore premium health products on Herbolife.',
      images: [product.image],
    },
    keywords:
      product.meta_keywords ||
      'health, wellness, nutrition, supplements, Herbolife, Health Products, Nutrition, original ayurvedic products',
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
    const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return <div className="text-center mt-20 text-red-600">Product not found</div>;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();

    const product: ProductWithSlug = {
      id: doc.id,
      name: data.name,
      image: data.image,
      category: data.category,
      label: data.label,
      description: data.description || 'Ayurvedic Product',
      price: Number(data.price),
      offer_price: Number(data.offer_price),
      slug: data.slug,
      meta_description: data.meta_description || '',
      meta_keywords: data.meta_keywords || '',
    };

    return <ProductClientView product={product} />;
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return <div className="text-center mt-20 text-red-600">Error loading product</div>;
  }
}
