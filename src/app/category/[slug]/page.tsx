// src/app/category/[slug]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useParams } from 'next/navigation'; // Use useParams to get the slug

type Product = {
  id: string;
  name: string;
  image: string;
  price: number;
  offer_price: number;
  category: string;
};

const CategoryPage = () => {
  const { slug } = useParams(); // Get slug from URL params
  const [categoryData, setCategoryData] = useState<Product[] | null>(null);

  // Fetch products based on category (slug) on component mount
  useEffect(() => {
    if (!slug) return;

    // Fetch products by category (slug)
    const fetchCategoryData = async () => {
      const q = query(collection(db, 'products'), where('category', '==', slug));
      const snapshot = await getDocs(q);
      const products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
      setCategoryData(products);
    };

    fetchCategoryData();
  }, [slug]); // Fetch when slug changes

  return (
    <div>
      <h1>Category: {slug}</h1>
      <div>
        {categoryData ? (
          categoryData.map((product) => (
            <div key={product.id}>
              <h3>{product.name}</h3>
              <img src={product.image} alt={product.name} />
              <p>Price: ₹{product.offer_price}</p>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
