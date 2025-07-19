import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop Health & Wellness Products | Herbolife Store',
  description:
    'Discover a wide range of health and wellness products including male enhancement supplements, energy boosters, immunity builders, and herbal remedies at Herbolife Store. Shop online for natural solutions to boost your lifestyle.',
  alternates: {
    canonical: 'https://store.herbolife.in/shop',
  },
  keywords: [
    'Herbolife products',
    'health supplements',
    'male enhancement',
    'energy boosters',
    'immunity support',
    'herbal wellness',
    'natural remedies',
    'fitness supplements',
  ],
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
