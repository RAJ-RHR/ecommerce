import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Cart | Herbolife Store',
  description: 'Review the health and wellness products in your cart before checkout. Modify quantities or remove items with ease at Herbolife Store.',
  alternates: {
    canonical: 'https://store.herbolife.in/cart',
  },
  keywords: [
    'Herbolife cart',
    'health products cart',
    'review order',
    'wellness supplements checkout',
    'natural remedies shopping',
  ],
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
