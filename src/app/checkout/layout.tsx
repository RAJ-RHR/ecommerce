import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout | Herbolife Store',
  description: 'Securely complete your purchase of health and wellness products. Fast, reliable checkout process at Herbolife Store.',
  alternates: {
    canonical: 'https://store.herbolife.in/checkout',
  },
  keywords: [
    'Herbolife checkout',
    'secure payment',
    'order confirmation',
    'buy wellness products',
    'natural supplements checkout',
  ],
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
