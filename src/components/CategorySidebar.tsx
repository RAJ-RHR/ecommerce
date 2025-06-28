'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Props = {
  onClose?: () => void;
  setCategory?: React.Dispatch<React.SetStateAction<string>>;
};

export default function CategorySidebar({ onClose, setCategory }: Props) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, 'categories'));
      const catList = snapshot.docs.map(doc => doc.id);
      setCategories(catList);
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <Link
          key={category}
          href={`/category/${encodeURIComponent(category)}`}
          onClick={() => {
            if (setCategory) setCategory(category);
            if (onClose) onClose();
          }}
          className="block p-2 text-sm rounded hover:bg-green-100"
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
