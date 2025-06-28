'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaBars } from 'react-icons/fa';

type Props = {
  setCategory?: (category: string) => void;
};

export default function CategorySidebar({ setCategory }: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'products'));
        const allCategories = snapshot.docs.map((doc) => doc.data().category as string);
        const uniqueCategories = Array.from(new Set(allCategories));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="fixed left-0 top-24 z-10">
      {/* Toggle Button */}
      <div
        className="bg-green-600 text-white px-4 py-2 rounded-r-md shadow cursor-pointer flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars />
        <span>Categories</span>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="mt-1 bg-white border border-gray-300 rounded-r-md shadow-md w-52">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div key={category}>
                {setCategory ? (
                  <button
                    onClick={() => {
                      setCategory(category);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-green-100 border-b last:border-none"
                  >
                    {category}
                  </button>
                ) : (
                  <Link
                    href={`/category/${encodeURIComponent(category)}`}
                    className="block px-4 py-2 text-sm hover:bg-green-100 border-b last:border-none"
                    onClick={() => setIsOpen(false)}
                  >
                    {category}
                  </Link>
                )}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">No categories found</div>
          )}
        </div>
      )}
    </div>
  );
}
