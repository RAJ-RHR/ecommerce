// app/category/[slug]/page.tsx
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';

// Fetch products based on category slug
async function fetchProductsByCategory(slug: string) {
  const decodedCategory = decodeURIComponent(slug);
  const q = query(collection(db, 'products'), where('category', '==', decodedCategory));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Ensure params are typed correctly for App Router
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  // Access slug directly from params
  const slug = params.slug;

  // Fetch the products
  const products = await fetchProductsByCategory(slug);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Category: {decodeURIComponent(slug)}</h2>
      {products.length === 0 && <p>No products found in this category.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <div key={product.id} className="border p-4 rounded shadow text-center">
            <Link href={`/products/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="h-40 w-full object-contain mb-2 bg-white p-2"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-500 line-through text-sm">₹{product.price}</p>
              <p className="text-green-600 font-bold">₹{product.offer_price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
