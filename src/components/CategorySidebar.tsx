'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const categories = [
  'Afresh Energy Drink Mix',
  'Combo Pack',
  'Digestive Health',
  'Enhancers',
  'Formula 1 Nutritional Shake Mix',
  'Personalized Protein Powder',
  'Male Enhancement',
  'Skin Care',
];

export default function CategorySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClick = (category: string) => {
    const slug = encodeURIComponent(category);
    router.push(`/category/${slug}`);
  };

  return (
    <div className="w-full md:w-64 bg-white border">
      {/* Collapse button */}
      <button
        className="w-full bg-green-500 text-white px-4 py-3 font-bold flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">☰ Category</span>
        <span className="text-xl">{isOpen ? '▲' : '▼'}</span>
      </button>

      {/* Category list */}
      {isOpen && (
        <ul className="border-t divide-y">
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => handleClick(category)}
              className="px-4 py-3 hover:bg-green-50 cursor-pointer text-sm md:text-base"
            >
              {category}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
